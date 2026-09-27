import React, { useEffect, useState } from 'react';
import { ArrowLeft, ClipboardList, Mail, MessageSquare, Phone, UserRound } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminApi } from '../services/adminApi';

interface Registration {
  id: number;
  eventId: number;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  submittedAt: string;
}

export const EventRegistrationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventTitle, setEventTitle] = useState('Event Registrations');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRegistrations = async () => {
      try {
        if (!id) throw new Error('Event not found');
        const [data, events] = await Promise.all([
          AdminApi.getEventRegistrations(Number(id)),
          AdminApi.getEvents(),
        ]);
        setRegistrations(Array.isArray(data) ? data : []);
        const event = Array.isArray(events) ? events.find((item: { id: number }) => item.id === Number(id)) : null;
        if (event) setEventTitle(event.title);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load registrations.');
      } finally {
        setLoading(false);
      }
    };

    loadRegistrations();
  }, [id]);

  return (
    <div>
      <div className="event-registrations-header">
        <div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/events')}>
            <ArrowLeft size={15} /> Back to Events
          </button>
          <h2>{eventTitle}</h2>
          <p>Submitted registrations for this event</p>
        </div>
        <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#2563EB' }}>
          <ClipboardList size={24} />
        </div>
      </div>

      {error && <div className="event-form-error"><MessageSquare size={16} />{error}</div>}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <h2>Registrations ({registrations.length})</h2>
            <p>Contact details submitted through the public event registration form</p>
          </div>
        </div>
        {loading ? (
          <div className="loading-indicator"><div className="spinner"></div><span>Loading registrations...</span></div>
        ) : registrations.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
            <ClipboardList size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No registrations have been submitted for this event yet.</p>
          </div>
        ) : (
          <div className="events-table-wrapper">
            <table className="custom-table event-registrations-table">
              <thead>
                <tr><th>Registrant</th><th>Phone</th><th>Message</th><th>Submitted</th></tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr key={registration.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <UserRound size={16} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <div><div style={{ fontWeight: 700 }}>{registration.fullName}</div><div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#718096', fontSize: '0.8rem' }}><Mail size={12} />{registration.email}</div></div>
                      </div>
                    </td>
                    <td><div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4A5568' }}><Phone size={14} />{registration.phone}</div></td>
                    <td style={{ maxWidth: '360px', color: '#4A5568', fontSize: '0.85rem' }}>{registration.message || '—'}</td>
                    <td style={{ color: '#718096', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{new Date(registration.submittedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
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