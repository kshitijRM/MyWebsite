import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PINNED_PROJECTS = [
  {
    id: 'pinned-secure-land-gaurdian',
    name: 'Secure-Land-Gaurdian',
    html_url: 'https://github.com/kshitijRM/Secure-Land-Gaurdian.git',
    description: 'Pinned first project.'
  },
  {
    id: 'pinned-sakshamnari-website',
    name: 'SakshamNari-Website',
    html_url: 'https://github.com/kshitijRM/SakshamNari-Website.git',
    description: 'Pinned second project.'
  },
  {
    id: 'pinned-dcet-prep-app',
    name: 'Dcet-prep-app',
    html_url: 'https://github.com/kshitijRM/Dcet-prep-app.git',
    description: 'Pinned third project.'
  }
];

const ProjectLink = ({ repo, index }) => {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group relative flex items-center justify-between gap-4 overflow-hidden border border-[var(--border-subtle)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.22))] px-5 py-4 transition-all duration-300 hover:border-[var(--accent-primary)] hover:bg-black/35"
      data-testid={`project-link-${repo.name}`}
    >
      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(224,255,0,0.12),transparent_55%)]" />
      <div className="min-w-0">
        <div className="truncate font-heading text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]">
          {repo.name}
        </div>
        {repo.description && (
          <div className="mt-1 truncate font-body text-sm text-[var(--text-secondary)]">
            {repo.description}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2 text-[var(--accent-primary)]">
        <span className="font-mono text-[10px] tracking-[0.3em]">OPEN</span>
        <ArrowUpRight
          size={16}
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </motion.a>
  );
};

export const ProjectZone = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get(`${API}/github/repos`);
        const sorted = response.data.sort((a, b) => {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });
        setRepos(sorted);
      } catch (err) {
        console.error('Failed to fetch repos:', err);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const visibleRepos = repos.slice(0, 9);
  const combinedProjects = [
    ...PINNED_PROJECTS,
    ...visibleRepos.filter(
      (repo) => !PINNED_PROJECTS.some((pinned) => pinned.html_url === repo.html_url || pinned.name === repo.name)
    )
  ].slice(0, 9);
  const primaryProject = combinedProjects[0];
  const secondaryProjects = combinedProjects.slice(1, 5);

  return (
    <section
      ref={ref}
      className="relative min-h-screen px-8 py-24 md:px-16 lg:px-24"
      data-testid="project-zone"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mb-16 max-w-5xl">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-4 font-mono text-xs tracking-[0.3em] text-[var(--accent-primary)]"
          >
            01 / PROJECTS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl tracking-tight text-[var(--text-primary)] md:text-5xl"
          >
            SELECTED <span className="text-[var(--accent-primary)]">PROJECTS</span>
          </motion.h2>
          <p className="mt-4 max-w-2xl font-body text-sm text-[var(--text-secondary)] md:text-base">
            Tap any entry to open the repository directly. The first three rows are pinned to your highlighted projects.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-4 text-[var(--text-secondary)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="h-6 w-6 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent"
              />
              <span className="font-mono text-sm">Loading projects...</span>
            </div>
          </div>
        )}

        {!loading && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {primaryProject ? (
              <ProjectLink key={primaryProject.id || primaryProject.name} repo={primaryProject} index={0} />
            ) : (
              <div className="glass-panel p-8 text-center text-[var(--text-secondary)]">
                No repositories available yet.
              </div>
            )}

            <div className="space-y-4">
              {secondaryProjects.map((repo, index) => (
                <ProjectLink key={repo.id || repo.name} repo={repo} index={index + 1} />
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="https://github.com/kshitijRM?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn"
              data-testid="view-all-projects"
            >
              VIEW REPOSITORIES
            </a>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectZone;
