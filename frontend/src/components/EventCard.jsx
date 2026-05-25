/**
 * EventCard - displays a single event in the events grid.
 * Styled with cinematic header background, metadata grid, and live capacity tracking.
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return { date: '—', time: '—' };
  const d = new Date(dateStr);
  const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  return {
    date: d.toLocaleDateString('en-IN', dateOptions),
    time: d.toLocaleTimeString('en-IN', timeOptions),
  };
}

export default function EventCard({ event }) {
  const registered = event.registered_count || 0;
  const capacity = event.capacity || 1;
  const fillPct = Math.min(100, Math.round((registered / capacity) * 100));
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
    <Link href={`/events/${event.id}`} className="event-card">
      <div className="event-card-header">
        <div>
          <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--sarc-teal)', fontWeight: 600, letterSpacing: '0.05em' }}>
            {event.instructor.split(' ')[0]} · SARC
          </span>
          <h3 className="event-card-title mt-1">{event.title}</h3>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="event-card-body">
        <div className="event-card-meta-grid">
          <div className="event-card-meta">
            <Calendar size={12} style={{ color: 'var(--sarc-teal)' }} />
            <span>{formatted.date}</span>
          </div>
          <div className="event-card-meta">
            <Clock size={12} style={{ color: 'var(--sarc-teal)' }} />
            <span>{formatted.time}</span>
          </div>
          <div className="event-card-meta">
            <MapPin size={12} style={{ color: 'var(--sarc-teal)' }} />
            <span>{event.location}</span>
          </div>
          <div className="event-card-meta">
            <User size={12} style={{ color: 'var(--sarc-teal)' }} />
            <span>{event.instructor}</span>
          </div>
        </div>

        {/* Live Capacity Indicator */}
        <div className="mt-4" style={{ borderTop: '1px solid rgba(120, 140, 255, 0.05)', paddingTop: '12px' }}>
          <div className="flex justify-between items-center text-xs mb-1">
            <span style={{ color: 'var(--text-secondary)' }}>
              {seatsLeft === 0 ? 'Closed' : `${seatsLeft} seats remaining`}
            </span>
            <span style={{ color: capacityColor, fontWeight: 600, fontSize: 10, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: capacityColor, display: 'inline-block' }} />
              {capacityLabel}
            </span>
          </div>
          <div className="capacity-bar">
            <motion.div
              className={fillClass}
              initial={{ width: 0 }}
              animate={{ width: `${fillPct}%` }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between items-center text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            <span>{registered} / {capacity} registered</span>
            <span>{fillPct}%</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
