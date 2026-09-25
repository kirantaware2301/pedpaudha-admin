import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminApi } from '../services/adminApi';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  Globe, 
  Eye, 
  EyeOff,
  ClipboardList
} from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  imageUrl: string;
  category: string;
  registrationUrl: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  'Healthcare',
  'Education',
  'Environment',
  'Food Support',
  'Women & Children',
  'Community',
  'Fundraiser',
  'Awareness'
];

export const EventsManagerPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await AdminApi.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await AdminApi.toggleEventPublish(id);
      loadEvents();
    } catch (err) {
      alert('Failed to update event publish status');
    }
  };

  const handleDelete = async (event: EventItem) => {
    if (!window.confirm(`Are you sure you want to delete the event "${event.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await AdminApi.deleteEvent(event.id);
      loadEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const publishedCount = events.filter(e => e.published).length;
  const upcomingCount = events.filter(e => new Date(e.eventDate) >= new Date(new Date().toDateString())).length;

  return (
    <div>
      {/* Metric Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total Events</h3>
            <div className="stat-number">{events.length}</div>
            <div className="stat-sub">Across all categoriees</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#2563EB' }}>
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Published Online</h3>
            <div className="stat-number" style={{ color: '#059669' }}>{publishedCount}</div>
            <div className="stat-sub">Visible on public site</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#ECFDF5', color: '#059669' }}>
            <Globe size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Upcoming Scheduled</h3>
            <div className="stat-number" style={{ color: '#D97706' }}>{upcomingCount}</div>
            <div className="stat-sub">Scheduled on or after today</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <h2>Events & Drives Management</h2>
            <p>Publish, edit, and track public community events stored live in Supabase</p>
          </div>
          <div className="table-actions">
            <button className="btn btn-primary" onClick={() => navigate('/events/new')}>
              <Plus size={18} />
              Create New Event
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : events.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
            <Calendar size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No events recorded yet. Click "Create New Event" to get started.</p>
          </div>
        ) : (
          <div className="events-table-wrapper">
          <table className="custom-table events-table">
            <thead>
              <tr>
                <th>Event Details</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {ev.imageUrl ? (
                        <img 
                          src={ev.imageUrl} 
                          alt={ev.title} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                          onError={(e: any) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Calendar size={20} color="#94A3B8" />
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.92rem' }}>
                          {ev.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#718096', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                          {ev.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                      {ev.category}
                    </span>
                  </td>
                  <td className="events-date-cell">
                    <div className="events-date-content">
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                      {new Date(ev.eventDate).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                      </div>
                      {ev.eventTime && (
                        <div style={{ fontSize: '0.78rem', color: '#718096' }}>
                          {ev.eventTime}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: '#4A5568', maxWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#718096" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.location}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublish(ev.id)}
                      className={`badge ${ev.published ? 'badge-success' : 'badge-neutral'}`}
                      style={{ cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      title="Click to toggle publish"
                    >
                      {ev.published ? <Eye size={12} /> : <EyeOff size={12} />}
                      {ev.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/events/${ev.id}/edit`)}
                        title="Edit Event"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate(`/events/${ev.id}/registrations`)}
                        title="View Registrations"
                      >
                        <ClipboardList size={14} /> Registrations
                      </button>
                      <button 
                        className="btn btn-danger-outline btn-sm"
                        onClick={() => handleDelete(ev)}
                        title="Delete Event"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

    </div>
  );
};
