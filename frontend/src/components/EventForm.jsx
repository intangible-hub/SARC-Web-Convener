/**
 * EventForm - modal dialogue to create or edit events.
 * Styled to fit SARC EventHub premium dark design system.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, AlignLeft, Info, HelpCircle } from 'lucide-react';

const EMPTY = { title: '', description: '', instructor: '', date: '', location: '', capacity: '', status: 'draft' };

export default function EventForm({ initialData = null, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        instructor: initialData.instructor || '',
        date: initialData.date ? initialData.date.slice(0, 16) : '',
        location: initialData.location || '',
        capacity: initialData.capacity || '',
        status: initialData.status || 'draft',
      });
    } else {
      setForm(EMPTY);
    }
  }, [initialData]);

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.instructor.trim()) errs.instructor = 'Instructor is required';
    if (!form.date) errs.date = 'Date is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.capacity || form.capacity < 1) errs.capacity = 'Capacity must be at least 1';
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  }

  return (
    <motion.div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        style={{ maxWidth: '540px' }}
      >
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h2 className="modal-title" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {initialData ? 'Modify SARC Event' : 'Create SARC Event'}
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ border: 'none', background: 'transparent', padding: '4px', fontSize: '14px' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title</label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Alumni Networking Night 2026"
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Speaker / Instructor</label>
              <input
                name="instructor"
                type="text"
                value={form.instructor}
                onChange={handleChange}
                placeholder="e.g. Ms. Neha Kapoor"
                className={`form-input ${errors.instructor ? 'error' : ''}`}
              />
              {errors.instructor && <p className="form-error">{errors.instructor}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. SAC Foyer, IIT Bombay"
                className={`form-input ${errors.location ? 'error' : ''}`}
              />
              {errors.location && <p className="form-error">{errors.location}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Provide a detailed description of the workshop outline, target audience, prerequisites, etc."
              rows={4}
              className={`form-input ${errors.description ? 'error' : ''}`}
              style={{ resize: 'none' }}
            />
            {errors.description && <p className="form-error">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Date & Time</label>
              <input
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? 'error' : ''}`}
              />
              {errors.date && <p className="form-error">{errors.date}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Seat Capacity</label>
              <input
                name="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 60"
                className={`form-input ${errors.capacity ? 'error' : ''}`}
              />
              {errors.capacity && <p className="form-error">{errors.capacity}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Publishing Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="draft">Draft (Visible only to Admins)</option>
              <option value="published">Published (Open for registrations)</option>
              <option value="cancelled">Cancelled (Closed with Cancelled label)</option>
            </select>
          </div>

          <div className="flex gap-3 mt-5" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Event'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
