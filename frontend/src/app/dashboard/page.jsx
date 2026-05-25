/**
 * Dashboard page - shows the current student's event registrations.
 * Animated stats counters and registration lists.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import RegistrationTable from '@/components/RegistrationTable';
import { ClipboardList, CheckCircle, Hourglass, Award } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export default function DashboardPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    try {
      const res = await api.get('/user/registrations/');
      setRegistrations(res.data);
    } catch {}
    setLoading(false);
  }

  return (
    <>
      <motion.div className="page-header" variants={fadeInUp} initial="hidden" animate="visible">
        <h1 className="page-title">My Registrations</h1>
        <p className="page-subtitle">
          Welcome back, {user?.name || 'Student'}. Monitor and review your registered SARC workshops and events.
        </p>
      </motion.div>

      {/* Student stats widgets */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Total Registrations', value: registrations.length, color: 'var(--sarc-blue)', icon: ClipboardList },
          { label: 'Accepted Invites', value: registrations.filter(r => r.status === 'accepted').length, color: 'var(--success)', icon: CheckCircle },
          { label: 'Pending Approvals', value: registrations.filter(r => r.status === 'pending').length, color: 'var(--warning)', icon: Hourglass },
        ].map(({ label, value, color, icon: Icon }) => (
          <motion.div key={label} variants={fadeInUp} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: 'Outfit, sans-serif' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
            <div style={{ background: 'rgba(120,140,255,0.04)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} style={{ color }} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {loading ? (
        <div>
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 50, marginBottom: 8, borderRadius: 6 }} />
          ))}
        </div>
      ) : (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Award size={14} style={{ color: 'var(--sarc-teal)' }} />
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration History</h2>
          </div>
          <RegistrationTable registrations={registrations} isAdmin={false} />
        </motion.div>
      )}
    </>
  );
}
