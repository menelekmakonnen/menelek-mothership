import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Breadcrumbs({ items, onNavigate }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-sm mb-6"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex items-center gap-2">
            {index === 0 && (
              <Home className="w-4 h-4 text-gray-400" />
            )}

            {!isLast ? (
              <>
                <button
                  onClick={() => onNavigate && onNavigate(item.id, index)}
                  className="text-green-400 hover:text-green-300 hover:underline transition-colors"
                >
                  {item.label}
                </button>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </>
            ) : (
              <span className="text-gray-400">{item.label}</span>
            )}
          </div>
        );
      })}
    </motion.nav>
  );
}
