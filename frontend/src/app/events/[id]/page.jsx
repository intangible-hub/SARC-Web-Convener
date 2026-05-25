/**
 * Event detail page - split dashboard layout showing comprehensive info and CTAs.
 */

'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { isAuthenticated, getUser } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import StatusBadge from '@/components/StatusBadge';
import { Calendar, Clock, MapPin, User, ChevronLeft, ShieldAlert, Award, FileText, Info, Compass } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return { date: '—', time: '—', month: '—', day: '—' };
  const d = new Date(dateStr);
  const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  
  // Extract month and day for the date block
  const month = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
  const day = d.getDate();

  return {
    date: d.toLocaleDateString('en-IN', dateOptions),
    time: d.toLocaleTimeString('en-IN', timeOptions),
    month,
    day
  };
}

export default function EventDetailPage({ params }) {
  const router = useRouter();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const user = getUser();

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    fetchEvent();
  }, [eventId]);

  async function fetchEvent() {
    try {
      const res = await api.get(`/events/${eventId}/`);
      setEvent(res.data);
    } catch {
      toast('Event not found', 'error');
      router.push('/events');
    }
    setLoading(false);
  }

  async function handleRegister() {
    setRegistering(true);
    try {
      await api.post('/events/register/', { event_id: event.id });
      toast('Registration submitted! Status: Pending', 'success');
      fetchEvent();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      toast(msg, 'error');
    }
    setRegistering(false);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 120, marginBottom: 24 }} />
        </div>
        <div>
          <div className="skeleton" style={{ height: 260 }} />
        </div>
      </div>
    );
  }

  if (!event) return null;

  const reg = event.user_registration;
  const fillPct = Math.min(100, Math.round((event.registered_count / event.capacity) * 100));
  const isFull = event.registered_count >= event.capacity;
  const registered = event.registered_count || 0;
  const capacity = event.capacity || 1;
  const seatsLeft = Math.max(0, capacity - registered);
  const formatted = formatDate(event.date);

  let capacityLabel = 'Open';
  let capacityColor = 'var(--sarc-teal)';
  let fillClass = 'capacity-fill';

  if (event.status === 'cancelled') {
    capacityLabel = 'Closed';
    capacityColor = 'var(--danger)';
  } else if (fillPct >= 100) {
    capacityLabel = 'Closed';
    capacityColor = 'var(--danger)';
    fillClass = 'capacity-fill full';
  } else if (fillPct >= 85) {
    capacityLabel = 'Almost Full';
    capacityColor = 'var(--danger)';
    fillClass = 'capacity-fill almost-full';
  } else if (fillPct >= 60) {
    capacityLabel = 'Filling Fast';
    capacityColor = 'var(--warning)';
    fillClass = 'capacity-fill almost-full';
  }

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/events" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ChevronLeft size={14} />
          <span>Back to Events</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Event Information & Description */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }} className="mb-5">
              {/* Date Box */}
              <div style={{
                background: 'rgba(120, 140, 255, 0.05)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                width: '64px',
                height: '64px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600, tracking: '0.05em' }}>{formatted.month}</span>
                <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', marginTop: '-2px' }}>{formatted.day}</span>
              </div>

              {/* Title Block */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--sarc-teal)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    Workshop Session
                  </span>
                  <StatusBadge status={event.status} />
                </div>
                <h1 className="page-title mt-1" style={{ fontSize: '22px' }}>{event.title}</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Connect. Collaborate. Create Impact.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Calendar size={16} style={{ color: 'var(--sarc-teal)' }} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Date & Time</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{formatted.date} ({formatted.time})</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={16} style={{ color: 'var(--sarc-teal)' }} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{event.location}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <User size={16} style={{ color: 'var(--sarc-teal)' }} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Instructor</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{event.instructor}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Award size={16} style={{ color: 'var(--sarc-teal)' }} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Organised by</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>{event.created_by_name}</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} style={{ color: 'var(--sarc-teal)' }} />
                <span>About this event</span>
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {event.description}
              </p>
            </div>
          </motion.div>

          <motion.div
            className="card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Compass size={14} style={{ color: 'var(--sarc-teal)' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Additional Details</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Who can join</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>All IIT Bombay Students</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Dress code</div>
                <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>Smart Casual</div>
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-student" style={{ padding: '4px 10px' }}>Networking</span>
              <span className="badge badge-student" style={{ padding: '4px 10px' }}>Alumni Meetup</span>
              <span className="badge badge-student" style={{ padding: '4px 10px' }}>Career Guidance</span>
              <span className="badge badge-student" style={{ padding: '4px 10px' }}>IIT Bombay</span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Event Visual Box, CTA, Stats & Capacities */}
        <div className="flex flex-col gap-6">
          <motion.div
            className="card"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            {/* Cinematic Gradient Visual Panel */}
            <div style={{
              height: '140px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(56, 189, 248, 0.05) 50%, rgba(6, 8, 22, 0.5) 100%)',
              border: '1px solid var(--border-color)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: '-40%',
                left: '-20%',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
                filter: 'blur(10px)'
              }} />
              <div style={{ zIndex: 1, textAlign: 'center', padding: '16px' }}>
                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sarc-teal)', fontWeight: 600 }}>SARC Session</span>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{event.title}</div>
              </div>
            </div>

            {/* Registration CTA area */}
            <div>
              {reg ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '12px',
                  background: 'rgba(120, 140, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Your Registration Status</span>
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0' }}>
                    <StatusBadge status={reg.status} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Registered at {new Date(reg.registered_at).toLocaleDateString('en-IN')}</span>
                </div>
              ) : user?.role === 'student' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <motion.button
                    id="register-btn"
                    className="btn btn-primary w-full"
                    onClick={handleRegister}
                    disabled={registering || isFull || event.status !== 'published'}
                    style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, var(--sarc-blue) 0%, #1e40af 100%)',
                      boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#ffffff'
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.15 }}
                  >
                    ⚡ {registering ? 'Submitting...' : isFull ? 'Event Full' : event.status !== 'published' ? 'Closed' : 'Register for this Event'}
                  </motion.button>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
                    ⏰ Registration closes shortly before the event starts.
                  </p>
                </div>
              ) : (
                <div style={{
                  padding: '12px',
                  background: 'rgba(239, 68, 68, 0.03)',
                  border: '1px dashed rgba(239, 68, 68, 0.2)',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center'
                }}>
                  <ShieldAlert size={14} style={{ color: 'var(--danger)' }} />
                  <span>Admin operators cannot register.</span>
                </div>
              )}
            </div>

            {/* Live capacity indicator */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div className="flex justify-between items-center text-xs mb-1">
                <span style={{ color: 'var(--text-secondary)' }}>Capacity Status</span>
                <span style={{ color: capacityColor, fontWeight: 600, fontSize: 10, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: capacityColor, display: 'inline-block' }} />
                  {capacityLabel}
                </span>
              </div>
              <div className="capacity-bar" style={{ height: '6px' }}>
                <motion.div
                  className={fillClass}
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPct}%` }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between items-center text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>{registered} / {capacity} seats taken</span>
                <span>{seatsLeft} left</span>
              </div>
            </div>

            {/* Quick stats info block */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Info size={13} style={{ color: 'var(--sarc-teal)' }} />
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Information</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Open to</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>All Students</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Registration Fee</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Contact email</span>
                  <span style={{ color: 'var(--text-primary)' }}>events@sarc.edu</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--text-secondary)' }}>Queries</span>
                  <span style={{ color: 'var(--text-primary)' }}>SARC Desk</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </>
  );
}
