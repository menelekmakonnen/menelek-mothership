import { motion } from 'framer-motion';
import { Brain, GraduationCap, Award, Users } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AI Starterclass',
    icon: GraduationCap,
    description: 'Comprehensive AI education program designed to bring beginners to proficiency in artificial intelligence and machine learning.',
    features: ['Hands-on Projects', 'Industry Experts', 'Certification'],
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 2,
    title: 'Scholarship Programs',
    icon: Award,
    description: 'Merit-based scholarships providing access to AI education for talented individuals from underrepresented communities.',
    features: ['Full Tuition', 'Mentorship', 'Career Support'],
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 3,
    title: 'AI Consultancy',
    icon: Brain,
    description: 'Strategic AI consulting services helping businesses leverage artificial intelligence for growth and innovation.',
    features: ['Custom Solutions', 'Implementation', 'Training'],
    color: 'from-green-600 to-emerald-600',
  },
  {
    id: 4,
    title: 'Community Hub',
    icon: Users,
    description: 'Vibrant community platform connecting AI enthusiasts, professionals, and learners worldwide.',
    features: ['Networking', 'Resources', 'Events'],
    color: 'from-orange-600 to-red-600',
  },
];

export default function AIProjectsSection() {
  return (
    <div className="w-full min-h-screen p-8 pt-32 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          AI Projects
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-12"
        >
          Innovation in artificial intelligence and education
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500 transition-all"
                whileHover={{ scale: 1.02, y: -4 }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold mb-4">{project.title}</h3>

                  {/* Description */}
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {project.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs mono"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button className="mt-6 text-green-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    Learn More →
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
