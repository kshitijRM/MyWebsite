import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Briefcase, Building2, ExternalLink, 
  Code2, Palette, Globe, Rocket, Users, TrendingUp,
  Quote, Star, ChevronRight, Zap
} from 'lucide-react';
import soundManager from '../../utils/sounds';

const PROFILE_IMAGE = 'https://customer-assets.emergentagent.com/job_kinetic-space/artifacts/zmhyo149_me.png';

// Business Info
const BUSINESS = {
  name: 'Renuka Digital Solutions',
  tagline: 'Transforming Ideas into Digital Reality',
  description: 'A full-service digital agency delivering cutting-edge web solutions, digital marketing strategies, and IT consulting to businesses worldwide.',
  location: 'https://maps.app.goo.gl/mJbx6fJsk2ukn57x9',
  founded: '2021',
  metrics: [
    { label: 'Projects Delivered', value: '100+', icon: Rocket },
    { label: 'Happy Clients', value: '50+', icon: Users },
    { label: 'Years Experience', value: '5+', icon: TrendingUp },
    { label: 'Success Rate', value: '99%', icon: Star },
  ],
  services: [
    { 
      title: 'Web Development', 
      description: 'Custom websites & web applications built with modern technologies',
      icon: Code2,
      color: '#E0FF00'
    },
    { 
      title: 'UI/UX Design', 
      description: 'Beautiful, intuitive interfaces that convert visitors into customers',
      icon: Palette,
      color: '#FF003C'
    },
    { 
      title: 'Digital Marketing', 
      description: 'SEO, social media & performance marketing that drives results',
      icon: Globe,
      color: '#00D4FF'
    },
    { 
      title: 'IT Consulting', 
      description: 'Strategic technology guidance to accelerate your business growth',
      icon: Zap,
      color: '#FF6B00'
    },
  ],
  techStack: [
    'React', 'Next.js', 'Node.js', 'Python', 'AWS', 'MongoDB', 
    'TypeScript', 'Tailwind', 'Figma', 'Docker'
  ],
  featuredProject: {
    title: 'E-Commerce Platform',
    description: 'Built a high-performance e-commerce solution handling 10K+ daily transactions',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=600&q=80',
    tech: ['Next.js', 'Node.js', 'MongoDB'],
    result: '150% increase in conversions'
  },
  testimonial: {
    quote: "Renuka Digital Solutions transformed our online presence completely. Their attention to detail and technical expertise exceeded our expectations. Highly recommended!",
    author: 'Rajesh Kumar',
    role: 'CEO, TechStart India',
    rating: 5
  }
};

const EXPERIENCE = [
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

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  React.useEffect(() => {
    if (isInView) {
      const numericValue = parseInt(value.replace(/\D/g, ''));
      const increment = numericValue / (duration * 60);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 1000 / 60);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);
  
  const suffix = value.replace(/[0-9]/g, '');
  return <span ref={ref}>{count}{suffix}</span>;
};

// Import React for useEffect in AnimatedCounter
import React from 'react';

// Service Card Component
const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = service.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => {
        setIsHovered(true);
        soundManager.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      <div 
        className={`
          relative p-6 border border-[var(--border-subtle)] bg-[var(--bg-glass)]
          backdrop-blur-xl transition-all duration-500 overflow-hidden
          ${isHovered ? 'border-opacity-100 transform -translate-y-2' : 'border-opacity-30'}
        `}
        style={{ 
          borderColor: isHovered ? service.color : undefined,
          boxShadow: isHovered ? `0 20px 40px rgba(0,0,0,0.3), 0 0 30px ${service.color}20` : undefined
        }}
      >
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${service.color}15, transparent 70%)`
          }}
        />
        
        {/* Icon */}
        <div 
          className="w-12 h-12 flex items-center justify-center mb-4 border transition-all duration-500"
          style={{ 
            borderColor: isHovered ? service.color : 'var(--border-subtle)',
            boxShadow: isHovered ? `0 0 20px ${service.color}40` : undefined
          }}
        >
          <Icon 
            size={24} 
            style={{ color: service.color }}
            className="transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Content */}
        <h4 className="font-heading text-lg text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
          {service.title}
        </h4>
        <p className="font-body text-sm text-[var(--text-secondary)] leading-relaxed">
          {service.description}
        </p>
        
        {/* Arrow */}
        <div className="mt-4 flex items-center gap-2 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-all duration-300">
          <span className="font-mono text-xs">Learn More</span>
          <ChevronRight 
            size={14} 
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </motion.div>
  );
};

// Tech Stack Pill
const TechPill = ({ tech, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.1, y: -2 }}
    className="px-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] 
               text-[var(--text-secondary)] font-mono text-xs cursor-default
               hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]
               hover:shadow-[0_0_15px_rgba(224,255,0,0.2)] transition-all duration-300"
  >
    {tech}
  </motion.span>
);

export const AboutZone = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });

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

        {/* Personal Bio Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-32">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative w-full max-w-md"
          >
            <div className="aspect-square overflow-hidden border border-[var(--border-subtle)] group">
              <img
                src={PROFILE_IMAGE}
                alt="Kshitij Dinni"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
            </div>
            {/* Decorative Frames */}
            <motion.div 
              className="absolute -top-4 -left-4 w-full h-full border border-[var(--accent-primary)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            />
            <motion.div 
              className="absolute -bottom-4 -right-4 w-full h-full border border-[var(--accent-secondary)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            />
          </motion.div>

          {/* Bio Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="font-body text-xl text-[var(--text-primary)] leading-relaxed">
                I'm <span className="text-[var(--accent-primary)] font-semibold">Kshitij Dinni</span>, a creative full-stack developer and entrepreneur passionate about building immersive digital experiences.
              </p>
              <p className="font-body text-[var(--text-secondary)] leading-relaxed">
                With expertise spanning from pixel-perfect frontends to robust backend architectures, I specialize in creating applications that are not just functional but truly memorable. My approach combines technical excellence with creative vision.
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
        </div>

        {/* ============ BUSINESS SECTION ============ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          {/* Business Header */}
          <div className="relative mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Building2 size={20} className="text-[var(--accent-primary)]" />
                  <span className="font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)]">
                    MY BUSINESS
                  </span>
                </div>
                <h3 className="font-heading text-3xl md:text-4xl text-[var(--text-primary)] mb-3">
                  {BUSINESS.name}
                </h3>
                <p className="font-body text-xl text-[var(--accent-primary)] italic">
                  "{BUSINESS.tagline}"
                </p>
              </div>
              
              <a
                href={BUSINESS.location}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn flex items-center gap-2"
                onMouseEnter={() => soundManager.playHover()}
              >
                <MapPin size={16} />
                VIEW LOCATION
                <ExternalLink size={14} />
              </a>
            </motion.div>
            
            {/* Decorative Line */}
            <motion.div 
              className="absolute -bottom-8 left-0 h-px bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>

          {/* Business Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-body text-lg text-[var(--text-secondary)] max-w-3xl mb-16"
          >
            {BUSINESS.description}
          </motion.p>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {BUSINESS.metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="relative p-6 border border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-sm
                             hover:border-[var(--accent-primary)] transition-all duration-500 group overflow-hidden"
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <Icon size={24} className="text-[var(--accent-primary)] mb-3" />
                  <div className="font-heading text-3xl md:text-4xl text-[var(--text-primary)] mb-1 glow-text">
                    <AnimatedCounter value={metric.value} />
                  </div>
                  <p className="font-mono text-xs text-[var(--text-muted)] tracking-wider uppercase">
                    {metric.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Services */}
          <div className="mb-20">
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-heading text-2xl text-[var(--text-primary)] mb-8 flex items-center gap-3"
            >
              <Zap size={24} className="text-[var(--accent-primary)]" />
              Services We Offer
            </motion.h4>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {BUSINESS.services.map((service, index) => (
                <ServiceCard key={service.title} service={service} index={index} />
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-20">
            <motion.h4
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-heading text-2xl text-[var(--text-primary)] mb-6 flex items-center gap-3"
            >
              <Code2 size={24} className="text-[var(--accent-primary)]" />
              Tech Stack
            </motion.h4>
            
            <div className="flex flex-wrap gap-3">
              {BUSINESS.techStack.map((tech, index) => (
                <TechPill key={tech} tech={tech} index={index} />
              ))}
            </div>
          </div>

          {/* Featured Project */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h4 className="font-heading text-2xl text-[var(--text-primary)] mb-8 flex items-center gap-3">
              <Rocket size={24} className="text-[var(--accent-primary)]" />
              Featured Project
            </h4>
            
            <div className="grid md:grid-cols-2 gap-8 p-6 border border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-xl
                          hover:border-[var(--accent-primary)] transition-all duration-500 group">
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={BUSINESS.featuredProject.image}
                  alt={BUSINESS.featuredProject.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-60" />
                
                {/* Result Badge */}
                <div className="absolute bottom-4 left-4 px-4 py-2 bg-[var(--accent-primary)] text-[var(--bg-primary)]">
                  <span className="font-mono text-xs font-bold">{BUSINESS.featuredProject.result}</span>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="flex flex-col justify-center">
                <h5 className="font-heading text-2xl text-[var(--text-primary)] mb-3 group-hover:text-[var(--accent-primary)] transition-colors">
                  {BUSINESS.featuredProject.title}
                </h5>
                <p className="font-body text-[var(--text-secondary)] mb-6">
                  {BUSINESS.featuredProject.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {BUSINESS.featuredProject.tech.map((t) => (
                    <span key={t} className="px-2 py-1 border border-[var(--accent-primary)] text-[var(--accent-primary)] font-mono text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-8 md:p-12 border border-[var(--border-subtle)] bg-[var(--bg-glass)] backdrop-blur-xl"
          >
            {/* Quote Icon */}
            <Quote size={48} className="text-[var(--accent-primary)] opacity-30 mb-6" />
            
            {/* Quote Text */}
            <p className="font-body text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed mb-8 italic">
              "{BUSINESS.testimonial.quote}"
            </p>
            
            {/* Author */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-heading text-lg text-[var(--text-primary)]">
                  {BUSINESS.testimonial.author}
                </p>
                <p className="font-mono text-sm text-[var(--text-muted)]">
                  {BUSINESS.testimonial.role}
                </p>
              </div>
              
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: BUSINESS.testimonial.rating }).map((_, i) => (
                  <Star key={i} size={20} className="text-[var(--accent-primary)] fill-[var(--accent-primary)]" />
                ))}
              </div>
            </div>
            
            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-[var(--accent-primary)] opacity-30" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-[var(--accent-primary)] opacity-30" />
          </motion.div>
        </motion.div>

        {/* ============ EXPERIENCE SECTION ============ */}
        <div>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl text-[var(--text-primary)] mb-8 flex items-center gap-3"
          >
            <Briefcase size={24} className="text-[var(--accent-primary)]" />
            Work Experience
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERIENCE.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-panel p-6 group hover:border-[var(--accent-primary)] transition-all duration-500"
                onMouseEnter={() => soundManager.playHover()}
                data-testid={`experience-${index}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-heading text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {exp.role}
                    </h4>
                    <p className="font-body text-[var(--accent-primary)]">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <span className="inline-block font-mono text-xs text-[var(--text-muted)] mb-3">
                  {exp.period}
                </span>
                <p className="font-body text-sm text-[var(--text-secondary)]">
                  {exp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutZone;
