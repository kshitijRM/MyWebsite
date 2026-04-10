import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Calendar, Briefcase, Building2, ExternalLink } from 'lucide-react';
import soundManager from '../../utils/sounds';

const PROFILE_IMAGE = 'https://customer-assets.emergentagent.com/job_kinetic-space/artifacts/zmhyo149_me.png';

const EXPERIENCE = [
  {
    role: 'Founder & CEO',
    company: 'Renuka Digital Solutions',
    period: '2021 - Present',
    description: 'Running my own digital solutions business, providing web development, digital marketing, and IT consulting services to clients.',
    isOwner: true,
    location: 'https://maps.app.goo.gl/mJbx6fJsk2ukn57x9'
  },
  {
    role: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    period: '2022 - Present',
    description: 'Leading development of scalable web applications using React, Node.js, and cloud technologies.'
  },
  {
    role: 'Full Stack Developer',
    company: 'Digital Solutions Ltd.',
    period: '2020 - 2022',
    description: 'Built and maintained multiple client projects, focusing on performance optimization and UX.'
  },
  {
    role: 'Frontend Developer',
    company: 'Creative Agency',
    period: '2019 - 2020',
    description: 'Developed interactive websites and web applications with modern JavaScript frameworks.'
  }
];

export const AboutZone = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-24 px-8 md:px-16 lg:px-24"
      data-testid="about-zone"
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
            03 / ABOUT
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]"
          >
            WHO I <span className="text-[var(--accent-primary)]">AM</span>
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Bio */}
          <div>
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative mb-8 w-full max-w-sm"
            >
              <div className="aspect-square overflow-hidden border border-[var(--border-subtle)]">
                <img
                  src={PROFILE_IMAGE}
                  alt="Kshitij Dinni"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                />
              </div>
              {/* Decorative Frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border border-[var(--accent-primary)] opacity-30" />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[var(--accent-secondary)] opacity-30" />
            </motion.div>

            {/* Bio Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <p className="font-body text-lg text-[var(--text-secondary)] leading-relaxed">
                I'm Kshitij Dinni, a creative full-stack developer passionate about 
                building immersive digital experiences that push the boundaries of 
                web technology.
              </p>
              <p className="font-body text-[var(--text-secondary)] leading-relaxed">
                With expertise spanning from pixel-perfect frontends to robust backend 
                architectures, I specialize in creating applications that are not just 
                functional but truly memorable. My approach combines technical excellence 
                with creative vision to deliver products that stand out.
              </p>
              
              {/* Quick Info */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <MapPin size={16} className="text-[var(--accent-primary)]" />
                  <span className="font-mono text-sm">India</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Calendar size={16} className="text-[var(--accent-primary)]" />
                  <span className="font-mono text-sm">Available for projects</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Experience */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-heading text-2xl text-[var(--text-primary)] mb-8 flex items-center gap-3"
            >
              <Briefcase size={24} className="text-[var(--accent-primary)]" />
              Experience
            </motion.h3>

            <div className="space-y-8">
              {EXPERIENCE.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={`glass-panel p-6 relative group ${exp.isOwner ? 'border-[var(--accent-primary)] border' : ''}`}
                  onMouseEnter={() => soundManager.playHover()}
                  data-testid={`experience-${index}`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-3 top-6 w-2 h-2 rounded-full ${exp.isOwner ? 'bg-[var(--accent-primary)] animate-pulse' : 'bg-[var(--accent-primary)]'}`} />
                  
                  {/* Owner Badge */}
                  {exp.isOwner && (
                    <div className="absolute -top-3 right-4 px-3 py-1 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-xs tracking-wider flex items-center gap-2">
                      <Building2 size={12} />
                      MY BUSINESS
                    </div>
                  )}
                  
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-heading text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {exp.role}
                      </h4>
                      <p className="font-body text-[var(--accent-primary)]">
                        {exp.company}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--text-muted)] whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="font-body text-sm text-[var(--text-secondary)] mb-3">
                    {exp.description}
                  </p>
                  
                  {/* Location Link for Business */}
                  {exp.location && (
                    <a
                      href={exp.location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors font-mono text-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapPin size={14} />
                      View Location
                      <ExternalLink size={12} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Timeline Line */}
            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-[var(--accent-primary)] via-[var(--border-subtle)] to-transparent opacity-30 hidden lg:block" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutZone;
