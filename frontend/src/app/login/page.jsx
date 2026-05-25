/**
 * Login page - email/password form with JWT authentication.
 * Styled as a dark cinematic SARC portal.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { setSession } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { Mail, Lock, ArrowRight, ShieldCheck, Key } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await api.post('/auth/login/', form);
      setSession(res.data.user, res.data.token, res.data.refresh_token);
      toast('Welcome back, ' + res.data.user.name + '!', 'success');
      router.push('/events');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed. Check your credentials.';
      toast(msg, 'error');
      setErrors({ password: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="auth-logo">
          <h1>SARC <span>EventHub</span></h1>
          <p>Student Alumni Relations Cell · IIT Bombay</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@sarc.edu"
                className={`form-input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: '36px' }}
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: '36px' }}
              />
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <motion.button
            id="login-submit"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight size={14} />}
          </motion.button>
        </form>

        <hr className="divider" style={{ opacity: 0.5 }} />
        
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
          Need an account?{' '}
          <Link href="/register" style={{ color: 'var(--sarc-teal)', fontWeight: 500 }}>Create student account</Link>
        </p>

        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: 'rgba(120,140,255,0.03)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
            <ShieldCheck size={13} style={{ color: 'var(--sarc-teal)' }} />
            <span>Developer Credentials</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'monospace' }}>
            <div>Admin: <span style={{ color: 'var(--text-primary)' }}>admin@sarc.edu</span> / <span style={{ color: 'var(--text-primary)' }}>admin123</span></div>
            <div>Student: <span style={{ color: 'var(--text-primary)' }}>student1@sarc.edu</span> / <span style={{ color: 'var(--text-primary)' }}>student123</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
