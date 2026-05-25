/**
 * Admin panel - event management and registration management.
 * Shows operational metrics and list management for events and registrations.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { isAuthenticated, getUser, isAdmin } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import StatusBadge from '@/components/StatusBadge';
import EventForm from '@/components/EventForm';
import RegistrationTable from '@/components/RegistrationTable';
import { Plus, Edit2, Trash2, CalendarDays, Users, Hourglass, Calendar, ClipboardCheck, Sparkles } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

const fadeInUp = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

export default function AdminPage() {
  const router = useRouter();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [eventFilter, setEventFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      router.push('/events');
      return;
    }
    fetchEvents();
    fetchRegistrations();
  }, []);

  async function fetchEvents() {
    setLoadingEvents(true);
    try {
      const res = await api.get('/events/');
      setEvents(res.data);
    } catch {}
    setLoadingEvents(false);
  }

  async function fetchRegistrations() {
    setLoadingRegs(true);
    try {
      const params = {};
      if (eventFilter) params.event_id = eventFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admin/registrations/', { params });
      setRegistrations(res.data);
    } catch {}
    setLoadingRegs(false);
  }

  useEffect(() => {
    if (!loadingRegs) fetchRegistrations();
  }, [eventFilter, statusFilter]);

  async function handleSaveEvent(formData) {
    setSaving(true);
    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent.id}/`, formData);
        toast('Event updated successfully', 'success');
      } else {
        await api.post('/admin/events/', formData);
        toast('New event created', 'success');
      }
      setFormOpen(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (err) {
      toast(err.response?.data?.detail || 'Save operation failed', 'error');
    }
    setSaving(false);
  }

  async function handleDeleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/admin/events/${id}/`);
      toast('Event deleted successfully', 'success');
      fetchEvents();
      fetchRegistrations(); // Update capacity lists
    } catch {
      toast('Failed to delete event', 'error');
    }
  }

  async function handleUpdateRegistration(id, newStatus) {
    try {
      await api.patch(`/admin/registrations/${id}/`, { status: newStatus });
      toast(`Registration status: ${newStatus}`, 'success');
      fetchRegistrations();
    } catch {
      toast('Update failed', 'error');
    }
  }

  return (
    <>
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="page-title">SARC Internal Operations</h1>
        <p className="page-subtitle">Manage upcoming activities and evaluate user registration statuses.</p>
      </motion.div>

      {/* Operations Analytics Metrics */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.2 }}
      >
        {[
          { label: 'Total Events', value: events.length, color: 'var(--sarc-blue)', icon: CalendarDays },
          { label: 'Total Registrations', value: registrations.length, color: 'var(--sarc-teal)', icon: Users },
          { label: 'Pending Approvals', value: registrations.filter(r => r.status === 'pending').length, color: 'var(--warning)', icon: Hourglass },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: 'Outfit, sans-serif' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2, fontWeight: 500 }}>{label}</div>
            </div>
            <div style={{ background: 'rgba(120,140,255,0.04)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} style={{ color }} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Tabs Layout */}
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 0 }}>
        {[
          { key: 'events', label: 'Event Operations', icon: Calendar },
          { key: 'registrations', label: 'Registrations Evaluator', icon: ClipboardCheck },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`tab-${key}`}
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab(key)}
            style={{
              borderRadius: '6px 6px 0 0',
              borderBottom: 'none',
              background: activeTab === key ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
              color: activeTab === key ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderColor: activeTab === key ? 'var(--border-hover)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontWeight: 600
            }}
          >
            <Icon size={14} style={{ color: activeTab === key ? 'var(--sarc-teal)' : 'var(--text-secondary)' }} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'events' && (
          <motion.section
            key="events-tab"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Events Directory</h2>
              <motion.button
                id="create-event-btn"
                className="btn btn-primary btn-sm"
                onClick={() => { setEditingEvent(null); setFormOpen(true); }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={13} />
                <span>Create SARC Event</span>
              </motion.button>
            </div>

            {loadingEvents ? (
              <div>{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 50, marginBottom: 8, borderRadius: 6 }} />)}</div>
            ) : events.length === 0 ? (
              <div className="empty-state" style={{ borderStyle: 'solid' }}>
                <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                  <CalendarDays size={38} style={{ color: 'var(--sarc-teal)', opacity: 0.6 }} />
                </div>
                <h3>No events found</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Get started by adding SARC operations events.</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 14 }} onClick={() => setFormOpen(true)}>
                  Create first event
                </button>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>#</th>
                      <th>Title</th>
                      <th>Speaker / Host</th>
                      <th>Event Date</th>
                      <th style={{ width: '90px' }}>Capacity</th>
                      <th style={{ width: '90px' }}>Joined</th>
                      <th style={{ width: '100px' }}>Status</th>
                      <th style={{ width: '120px' }}>Operations</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {events.map((event, idx) => (
                      <motion.tr key={event.id} variants={fadeInUp}>
                        <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{String(idx + 1).padStart(2, '0')}</td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{event.title}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{event.instructor}</td>
                        <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{formatDate(event.date)}</td>
                        <td style={{ fontWeight: 500 }}>{event.capacity}</td>
                        <td style={{ fontWeight: 500, color: 'var(--sarc-teal)' }}>{event.registered_count}</td>
                        <td><StatusBadge status={event.status} /></td>
                        <td>
                          <div className="flex gap-2">
                            <motion.button
                              className="btn btn-secondary btn-sm"
                              onClick={() => { setEditingEvent(event); setFormOpen(true); }}
                              style={{ padding: '6px' }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Edit Event"
                            >
                              <Edit2 size={13} />
                            </motion.button>
                            <motion.button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteEvent(event.id)}
                              style={{ padding: '6px' }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="Delete Event"
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            )}
          </motion.section>
        )}

        {activeTab === 'registrations' && (
          <motion.section
            key="registrations-tab"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex gap-3 mb-4 flex-wrap items-center">
              <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', flex: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Registrations evaluation queue
              </h2>
              <select
                id="reg-event-filter"
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="form-input"
                style={{ maxWidth: 220 }}
              >
                <option value="">Filter by Event</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>{e.title}</option>
                ))}
              </select>
              <select
                id="reg-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-input"
                style={{ maxWidth: 160 }}
              >
                <option value="">Filter by Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {loadingRegs ? (
              <div>{[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 50, marginBottom: 8, borderRadius: 6 }} />)}</div>
            ) : (
              <RegistrationTable
                registrations={registrations}
                isAdmin={true}
                onAccept={(id) => handleUpdateRegistration(id, 'accepted')}
                onReject={(id) => handleUpdateRegistration(id, 'rejected')}
              />
            )}
          </motion.section>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {formOpen && (
          <EventForm
            initialData={editingEvent}
            onSubmit={handleSaveEvent}
            onClose={() => { setFormOpen(false); setEditingEvent(null); }}
            loading={saving}
          />
        )}
      </AnimatePresence>
    </>
  );
}
