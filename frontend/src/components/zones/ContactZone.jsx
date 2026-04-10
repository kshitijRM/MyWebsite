import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Github, Linkedin, Mail, Phone } from 'lucide-react';
import axios from 'axios';
import soundManager from '../../utils/sounds';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const ContactZone = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      await axios.post(`${API}/contact`, formData);
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      soundManager.playSuccess();
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen py-24 px-8 md:px-16 lg:px-24"
      data-testid="contact-zone"
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
            04 / CONTACT
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-5xl tracking-tight text-[var(--text-primary)]"
          >
            LET'S <span className="text-[var(--accent-primary)]">CONNECT</span>
          </motion.h2>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="font-body text-lg text-[var(--text-secondary)] leading-relaxed max-w-md">
              Have a project in mind? Let's create something extraordinary together. 
              I'm always open to discussing new projects and creative ideas.
            </p>

            {/* Contact Links */}
            <div className="space-y-6">
              <a
                href="mailto:support@kshitijdinni.e"
                className="flex items-center gap-4 group"
                onMouseEnter={() => soundManager.playHover()}
                data-testid="contact-email"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors">
                  <Mail size={20} className="text-[var(--accent-primary)]" />
                </div>
                <div>
                  <p className="font-mono text-xs text-[var(--text-muted)]">EMAIL</p>
                  <p className="font-body text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    support@kshitijdinni.e
                  </p>
                </div>
              </a>

              <a
                href="tel:9272501980"
                className="flex items-center gap-4 group"
                onMouseEnter={() => soundManager.playHover()}
                data-testid="contact-phone"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-[var(--border-subtle)] group-hover:border-[var(--accent-primary)] transition-colors">
                  <Phone size={20} className="text-[var(--accent-primary)]" />
                </div>
                <div>
                  <p className="font-mono text-xs text-[var(--text-muted)]">PHONE</p>
                  <p className="font-body text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    +91 9272501980
                  </p>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-6">
              <a
                href="https://github.com/kshitijRM"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all"
                onMouseEnter={() => soundManager.playHover()}
                data-testid="social-github"
              >
                <Github size={20} className="text-[var(--text-secondary)]" />
              </a>
              <a
                href="https://www.linkedin.com/in/kshitij-dinni"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-all"
                onMouseEnter={() => soundManager.playHover()}
                data-testid="social-linkedin"
              >
                <Linkedin size={20} className="text-[var(--text-secondary)]" />
              </a>
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              {/* Name Field */}
              <div>
                <label className="font-mono text-xs text-[var(--text-muted)] tracking-wider block mb-2">
                  NAME
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Your name"
                  data-testid="input-name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="font-mono text-xs text-[var(--text-muted)] tracking-wider block mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="your@email.com"
                  data-testid="input-email"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="font-mono text-xs text-[var(--text-muted)] tracking-wider block mb-2">
                  MESSAGE
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="form-input resize-none"
                  placeholder="Tell me about your project..."
                  data-testid="input-message"
                />
              </div>

              {/* Status Message */}
              {status.type && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 p-4 ${
                    status.type === 'success' 
                      ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]' 
                      : 'bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]'
                  }`}
                  data-testid="form-status"
                >
                  {status.type === 'success' ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}
                  <span className="font-mono text-sm">{status.message}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="magnetic-btn w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                onMouseEnter={() => soundManager.playHover()}
                data-testid="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                    />
                    SENDING...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    SEND MESSAGE
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 pt-8 border-t border-[var(--border-subtle)] text-center"
        >
          <p className="font-mono text-xs text-[var(--text-muted)]">
            © {new Date().getFullYear()} Kshitij Dinni. All rights reserved.
          </p>
        </motion.footer>
      </motion.div>
    </section>
  );
};

export default ContactZone;
