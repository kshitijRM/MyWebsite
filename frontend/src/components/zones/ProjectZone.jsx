import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Star, GitFork, Code2 } from 'lucide-react';
import axios from 'axios';
import soundManager from '../../utils/sounds';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language colors
const LANGUAGE_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Java: '#ED8B00',
  'C++': '#00599C',
  C: '#A8B9CC',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Ruby: '#CC342D',
  PHP: '#777BB4',
  Swift: '#FA7343',
  Kotlin: '#7F52FF',
  HTML: '#E34F26',
  CSS: '#1572B6',
  SCSS: '#CC6699',
  Vue: '#4FC08D',
  React: '#61DAFB',
  default: '#E0FF00'
};

const ProjectCard = ({ repo, index, isHighlighted }) => {
  const [isHovered, setIsHovered] = useState(false);
  const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default;

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`block project-card p-6 ${isHighlighted ? 'border-[var(--accent-primary)]' : ''}`}
      onMouseEnter={() => {
        setIsHovered(true);
        soundManager.playHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`project-card-${repo.name}`}
    >
      {/* Highlighted Badge */}
      {isHighlighted && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-[var(--accent-primary)] text-[var(--bg-primary)] font-mono text-xs tracking-wider">
          FEATURED
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Code2 
            size={20} 
            className={isHovered ? 'text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}
          />
          <h3 className="font-heading text-lg text-[var(--text-primary)] truncate max-w-[200px]">
            {repo.name}
          </h3>
        </div>
        <ExternalLink 
          size={16} 
          className={`transition-all ${isHovered ? 'text-[var(--accent-primary)] translate-x-1 -translate-y-1' : 'text-[var(--text-muted)]'}`}
        />
      </div>

      {/* Description */}
      <p className="font-body text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 min-h-[40px]">
        {repo.description || 'No description available'}
      </p>

      {/* Topics */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.topics.slice(0, 3).map((topic) => (
            <span 
              key={topic}
              className="px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-muted)] font-mono text-xs rounded-none"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <Star size={14} />
            <span className="font-mono text-xs">{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
            <GitFork size={14} />
            <span className="font-mono text-xs">{repo.forks_count}</span>
          </div>
        </div>
        
        {repo.language && (
          <div className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            <span className="font-mono text-xs text-[var(--text-secondary)]">
              {repo.language}
            </span>
          </div>
        )}
      </div>
    </motion.a>
  );
};

export const ProjectZone = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`${API}/github/repos`);
        // Sort by stars and recent activity
        const sorted = response.data.sort((a, b) => {
          const scoreA = a.stargazers_count * 2 + a.forks_count;
          const scoreB = b.stargazers_count * 2 + b.forks_count;
          return scoreB - scoreA;
        });
        setRepos(sorted);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch repos:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  // Determine highlighted projects (top 3 by stars)
  const highlightedNames = repos.slice(0, 3).map(r => r.name);

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-24 px-8 md:px-16 lg:px-24"
      data-testid="project-zone"
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
            01 / PROJECTS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]"
          >
            SELECTED <span className="text-[var(--accent-primary)]">WORKS</span>
          </motion.h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-4 text-[var(--text-secondary)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full"
              />
              <span className="font-mono text-sm">Loading projects...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-panel p-8 text-center">
            <p className="text-[var(--accent-secondary)] font-mono text-sm">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.slice(0, 9).map((repo, index) => (
              <ProjectCard
                key={repo.id}
                repo={repo}
                index={index}
                isHighlighted={highlightedNames.includes(repo.name)}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        {!loading && !error && repos.length > 9 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="https://github.com/kshitijRM"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn"
              onMouseEnter={() => soundManager.playHover()}
              onClick={() => soundManager.playClick()}
              data-testid="view-all-projects"
            >
              VIEW ALL ON GITHUB
            </a>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectZone;
