import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Briefcase, Award } from 'lucide-react';
import cvData from '../../public/data/cv.json';

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
            Sobre Mim
          </h1>
          <p className="text-xl text-muted-foreground">
            Conheça a história e experiência
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass mb-12 p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative h-32 w-32 shrink-0 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-1 shadow-md">
              <div className="h-full w-full overflow-hidden rounded-[1.25rem]">
                <img
                  src={cvData.profile.avatar}
                  alt={cvData.profile.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-display font-bold mb-2">
                {cvData.profile.name}
              </h2>
              <p className="text-lg text-primary mb-3">
                {cvData.profile.headline}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground mb-6 justify-center md:justify-start">
                <MapPin size={18} />
                <span>{cvData.profile.location}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {cvData.profile.bio}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="text-primary" size={28} />
            <h2 className="text-3xl font-display font-bold">Experiência</h2>
          </div>
          
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, x: -20 }
                }
                animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={prefersReducedMotion ? undefined : { y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                className="glass p-6 hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-display font-bold mb-1">
                      {exp.role}
                    </h3>
                    <p className="text-primary font-medium mb-2">{exp.org}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin size={14} />
                      {exp.location}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2 md:mt-0">
                    {new Date(exp.start).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })} - {exp.end ? new Date(exp.end).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' }) : 'Presente'}
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1.5">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-primary" size={28} />
            <h2 className="text-3xl font-display font-bold">Competências</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {cvData.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }
                }
                animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                whileHover={prefersReducedMotion ? undefined : { y: -3, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }}
                className="glass flex items-center justify-between p-4 transition-shadow hover:shadow-lg"
              >
                <div>
                  <h4 className="font-semibold mb-1">{skill.name}</h4>
                  <p className="text-sm text-muted-foreground">{skill.category}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                  {skill.level}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}