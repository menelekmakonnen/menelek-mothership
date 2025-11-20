import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';
import SocialLinks from '@/components/common/SocialLinks';

export default function PowerOffScreen() {
  const { dismissPowerOffScreen, powerOn } = useCameraContext();

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex items-center justify-center">
      <div className="max-w-2xl w-full px-8">
        {/* Power Off Message */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"
          >
            <Power size={48} className="text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            System Powering Down
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Thanks for visiting!
          </p>
          <p className="text-gray-500 text-sm">
            Memory saved • Settings preserved
          </p>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <p className="text-gray-400 text-sm text-center mb-6">
            Connect with me:
          </p>
          <SocialLinks />
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={powerOn}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all"
          >
            <div className="flex items-center justify-center gap-3">
              <Power size={20} />
              <span>Power Back On</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={dismissPowerOffScreen}
            className="px-8 py-4 rounded-full bg-gray-900 border border-gray-800 text-gray-300 font-semibold text-lg hover:bg-gray-800 transition-all"
          >
            Continue Power Off
          </motion.button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-xs font-mono">
            © {new Date().getFullYear()} Menelek Makonnen • All Rights Reserved
          </p>
          <p className="text-gray-700 text-xs font-mono mt-1">
            Portfolio v2.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}
