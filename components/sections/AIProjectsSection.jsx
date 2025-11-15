import { motion } from 'framer-motion';
import { Brain, GraduationCap, Award, Users, ExternalLink } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AI Starter Class',
    icon: GraduationCap,
    description: 'Comprehensive AI education program designed to bring beginners to proficiency in artificial intelligence and machine learning.',
    features: ['Hands-on Projects', 'Industry Experts', 'Certification'],
    color: 'from-blue-600 to-cyan-600',
    url: 'https://starterclass.icuni.org',
    available: true,
  },
  {
    id: 2,
    title: 'Scholarship Program',
    icon: Award,
    description: 'Merit-based scholarships providing access to AI education for talented individuals from underrepresented communities.',
    features: ['Full Tuition', 'Mentorship', 'Career Support'],
    color: 'from-purple-600 to-pink-600',
    url: 'https://scholarships.icuni.org',
    available: true,
  },
  {
    id: 3,
    title: 'AI Consultancy',
    icon: Brain,
    description: 'Strategic AI consulting services helping businesses leverage artificial intelligence for growth and innovation.',
    features: ['Custom Solutions', 'Implementation', 'Training'],
    color: 'from-green-600 to-emerald-600',
    url: null,
    available: false,
  },
  {
    id: 4,
    title: 'Community Hub',
    icon: Users,
    description: 'Vibrant community platform connecting AI enthusiasts, professionals, and learners worldwide.',
    features: ['Networking', 'Resources', 'Events'],
    color: 'from-orange-600 to-red-600',
    url: null,
    available: false,
  },
];

export default function AIProjectsSection() {
  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 pt-32 pb-32">
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
          className="text-xl text-[color:var(--text-secondary)] mb-12"
        >
          Innovation in artificial intelligence and education
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            const CardWrapper = project.available ? 'a' : 'div';
            const cardProps = project.available
              ? {
                  href: project.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                }
              : {};

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: project.available ? 1.02 : 1, y: project.available ? -4 : 0 }}
              >
                <CardWrapper
                  {...cardProps}
                  className={`group relative overflow-hidden rounded-2xl p-8 bg-[color:var(--bg-secondary)]/95 backdrop-blur border border-[color:var(--hud-border)]/40 transition-all block ${
                    project.available ? 'hover:border-green-500 cursor-pointer' : 'opacity-60'
                  }`}
                >
                  {/* Coming Soon Badge */}
                  {!project.available && (
                    <div className="absolute top-4 right-4 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                      <span className="text-yellow-400 font-bold text-xs mono">COMING SOON</span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 ${project.available ? 'group-hover:opacity-10' : ''} transition-opacity`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center mb-6 ${project.available ? 'group-hover:scale-110' : ''} transition-transform`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold mb-4">{project.title}</h3>

                    {/* Description */}
                <p className="text-[color:var(--text-secondary)] mb-6 leading-relaxed">
                  {project.description}
                </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
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
                    {project.available && (
                      <div className="flex items-center gap-2 text-green-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Visit Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
