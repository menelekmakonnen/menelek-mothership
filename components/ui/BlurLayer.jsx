import { useCameraContext } from '@/context/CameraContext';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

export default function BlurLayer({
  children,
  depth = 100,
  className = '',
  layerId,
  type = 'content',
  focusOnMount = false,
  lockGestures = false,
  onClose,
}) {
  const {
    focusedLayer,
    focusLayer,
    registerLayer,
    unregisterLayer,
    calculateBlur,
    getIsoNoise,
    getWhiteBalanceFilter,
    engageGestureLock,
    releaseGestureLock,
  } = useCameraContext();

  const controls = useAnimation();
  const elementRef = useRef(null);
  const generatedIdRef = useRef(layerId || `layer-${depth}-${Math.random().toString(36).slice(2)}`);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const id = layerId || generatedIdRef.current;

  useEffect(() => {
    const registeredOnClose = () => {
      if (typeof onCloseRef.current === 'function') {
        onCloseRef.current();
      }
    };

    registerLayer({ id, depth, type, ref: elementRef, onClose: registeredOnClose });
    return () => unregisterLayer(id);
  }, [id, depth, type, registerLayer, unregisterLayer]);

  useEffect(() => {
    if (focusOnMount) {
      focusLayer(id);
    }
  }, [focusOnMount, focusLayer, id]);

  useEffect(() => {
    if (type !== 'interactive') return;
    const node = elementRef.current;
    if (!node) return;
    const frame = requestAnimationFrame(() => {
      try {
        node.focus({ preventScroll: true });
      } catch (err) {
        node.focus();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [type]);

  useEffect(() => {
    if (!lockGestures) return;
    engageGestureLock(id);
    return () => releaseGestureLock(id);
  }, [lockGestures, engageGestureLock, releaseGestureLock, id]);

  const blurAmount = useMemo(() => calculateBlur(depth, focusedLayer), [calculateBlur, depth, focusedLayer]);
  const resolvedBlur = type === 'interactive' ? 0 : blurAmount;
  const isoNoise = getIsoNoise();
  const wbFilter = getWhiteBalanceFilter();

  const baseFilter = wbFilter.filter ? `${wbFilter.filter} ` : '';
  const restingFilter = `${baseFilter}blur(${resolvedBlur}px)`;
  const focusPulseFilter = `${baseFilter}blur(${type === 'interactive' ? 0 : Math.max(resolvedBlur, 6)}px)`;
  const hasFocusedRef = useRef(false);

  useEffect(() => {
    if (focusedLayer === depth) {
      if (!hasFocusedRef.current) {
        hasFocusedRef.current = true;
        controls.start({
          filter: [focusPulseFilter, restingFilter],
          transition: { duration: 0.45, ease: 'easeOut' },
        });
      } else {
        controls.start({
          filter: restingFilter,
          transition: { duration: 0.3, ease: 'easeOut' },
        });
      }
    } else {
      hasFocusedRef.current = false;
      controls.start({
        filter: restingFilter,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
    }
  }, [controls, focusPulseFilter, focusedLayer, restingFilter, depth]);

  const composedClassName = useMemo(() => {
    const interactiveBackdrop = type === 'interactive'
      ? 'bg-[rgba(6,8,12,0.92)] backdrop-blur-xl outline outline-1 outline-white/10'
      : '';
    return ['blur-layer', interactiveBackdrop, className].filter(Boolean).join(' ');
  }, [className, type]);

  const handlePointerDown = () => {
    focusLayer(id);
  };

  const showIsoNoise = isoNoise > 0 && type !== 'interactive';

  return (
    <motion.div
      ref={elementRef}
      data-depth-layer={id}
      className={composedClassName}
      style={{ zIndex: depth }}
      onPointerDown={handlePointerDown}
      animate={controls}
      initial={{ filter: focusOnMount ? focusPulseFilter : restingFilter }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      tabIndex={type === 'interactive' ? -1 : undefined}
      role={type === 'interactive' ? 'dialog' : undefined}
      aria-modal={type === 'interactive' ? 'true' : undefined}
    >
      {children}
      {showIsoNoise && (
        <div
          className="iso-noise"
          style={{ opacity: isoNoise }}
        />
      )}
    </motion.div>
  );
}
