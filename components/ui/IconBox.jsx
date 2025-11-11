import { motion } from 'framer-motion';

/**
 * Premium icon box with gradient background
 * Matches the AI Albums aesthetic
 */
export default function IconBox({ icon: Icon, gradient, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  };

  return (
    <motion.div
      className={`${sizes[size]} rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      <Icon className={`${iconSizes[size]} text-white`} />
    </motion.div>
  );
}
