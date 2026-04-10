import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import soundManager from '../../utils/sounds';

const SKILLS = [
  { name: 'React', category: 'Frontend', level: 95 },
  { name: 'TypeScript', category: 'Frontend', level: 90 },
  { name: 'Next.js', category: 'Frontend', level: 88 },
  { name: 'Three.js', category: 'Frontend', level: 80 },
  { name: 'Tailwind', category: 'Frontend', level: 95 },
  { name: 'Node.js', category: 'Backend', level: 92 },
  { name: 'Python', category: 'Backend', level: 88 },
  { name: 'FastAPI', category: 'Backend', level: 85 },
  { name: 'MongoDB', category: 'Backend', level: 90 },
  { name: 'PostgreSQL', category: 'Backend', level: 85 },
  { name: 'Docker', category: 'DevOps', level: 82 },
  { name: 'AWS', category: 'DevOps', level: 78 },
  { name: 'Git', category: 'DevOps', level: 95 },
  { name: 'CI/CD', category: 'DevOps', level: 80 },
  { name: 'Figma', category: 'Design', level: 75 },
  { name: 'WebGL', category: 'Creative', level: 70 },
];

const CATEGORIES = ['All', 'Frontend', 'Backend', 'DevOps', 'Design', 'Creative'];

const SkillOrb = ({ skill, index, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 200
      }}
      className={`relative group ${!isActive ? 'opacity-30' : ''}`}
      onMouseEnter={() => {
        setIsHovered(true);
        soundManager.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`skill-orb-${skill.name.toLowerCase()}`}
    >
      {/* Orb */}
      <motion.div
        className="skill-orb cursor-pointer"
        animate={{
          scale: isHovered ? 1.15 : 1,
          borderColor: isHovered ? 'var(--accent-primary)' : 'var(--border-subtle)'
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="font-mono text-xs text-[var(--text-primary)] text-center leading-tight">
          {skill.name}
        </span>
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10
        }}
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 whitespace-nowrap z-20 pointer-events-none"
      >
        <div className="text-center">
          <p className="font-mono text-xs text-[var(--accent-primary)]">{skill.category}</p>
          <div className="w-20 h-1 bg-[var(--bg-secondary)] mt-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--accent-primary)]"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? `${skill.level}%` : 0 }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{skill.level}%</p>
        </div>
      </motion.div>

      {/* Glow Ring */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full border border-[var(--accent-primary)]"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
};

export const SkillsZone = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredSkills = activeCategory === 'All' 
    ? SKILLS 
    : SKILLS.filter(s => s.category === activeCategory);

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-24 px-8 md:px-16 lg:px-24"
      data-testid="skills-zone"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Section Header */}
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)] mb-4"
          >
            02 / SKILLS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]"
          >
            TECH <span className="text-[var(--accent-primary)]">STACK</span>
          </motion.h2>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 mb-12"
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                soundManager.playClick();
              }}
              className={`font-mono text-xs tracking-wider px-4 py-2 border transition-all duration-300 ${
                activeCategory === category
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
              }`}
              onMouseEnter={() => soundManager.playHover()}
              data-testid={`filter-${category.toLowerCase()}`}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {SKILLS.map((skill, index) => (
            <SkillOrb
              key={skill.name}
              skill={skill}
              index={index}
              isActive={activeCategory === 'All' || skill.category === activeCategory}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { label: 'Years Experience', value: '5+' },
            { label: 'Projects Completed', value: '50+' },
            { label: 'Technologies', value: '30+' },
            { label: 'Happy Clients', value: '20+' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="font-heading text-4xl md:text-5xl text-[var(--accent-primary)] glow-text"
              >
                {stat.value}
              </motion.p>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-2 tracking-wider">
                {stat.label.toUpperCase()}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SkillsZone;
