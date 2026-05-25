/**
 * Events listing page - shows all published events in a grid.
 * Supports search and status filter. Animated with Framer Motion.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import EventCard from '@/components/EventCard';
import { Search, SlidersHorizontal, CalendarDays } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: '80px', width: '100%' }} />
      <div style={{ padding: '16px' }}>
        <div className="skeleton" style={{ height: '14px', width: '80%', marginBottom: '12px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div className="skeleton" style={{ height: '10px', width: '60%' }} />
          <div className="skeleton" style={{ height: '10px', width: '70%' }} />
          <div className="skeleton" style={{ height: '10px', width: '50%' }} />
          <div className="skeleton" style={{ height: '10px', width: '80%' }} />
        </div>
        <div className="skeleton" style={{ height: '14px', width: '100%', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    fetchEvents();
  }, [statusFilter]);

  async function fetchEvents() {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await api.get('/events/', { params });
      setEvents(res.data);
    } catch {}
    setLoading(false);
  }

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.instructor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="page-title">SARC Events</h1>
        <p className="page-subtitle">Browse and register for workshops, networking sessions, and webinars.</p>
      </motion.div>

      <motion.div
        className="flex gap-3 mb-6 flex-wrap items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.2 }}
      >
        <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '320px' }}>
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            id="events-search"
            type="text"
            placeholder="Search by event or speaker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px' }}
          />
        </div>

        <div style={{ position: 'relative', flex: '1', minWidth: '150px', maxWidth: '200px' }}>
          <SlidersHorizontal size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <select
            id="events-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '34px' }}
          >
            <option value="">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div className="empty-state" variants={fadeInUp} initial="hidden" animate="visible" style={{ borderStyle: 'solid' }}>
          <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <CalendarDays size={40} style={{ color: 'var(--sarc-teal)', opacity: 0.6 }} />
          </div>
          <h3>No events found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            {search ? 'Try checking your spelling or selecting another filter.' : 'We are currently preparing new activities. Stay tuned!'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((event) => (
            <motion.div key={event.id} variants={fadeInUp}>
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
