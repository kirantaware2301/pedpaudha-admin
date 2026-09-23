import React, { useEffect, useState } from 'react';
import { AdminApi } from '../services/adminApi';
import { Trash2, Eye, Mail, Reply, CheckCircle } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'NEW', 'READ', 'REPLIED', 'ARCHIVED'];

const badgeClass = (status: string) => {
  switch (status) {
    case 'REPLIED': return 'badge-success';
    case 'READ': return 'badge-info';
    case 'ARCHIVED': return 'badge-neutral';
    default: return 'badge-warning';
  }
};

export const ContactInquiriesPage: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  useEffect(() => {
    loadContacts();
  }, [statusFilter]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await AdminApi.getContacts(statusFilter);
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await AdminApi.updateContactStatus(id, status);
      loadContacts();
      if (selectedContact?.id === id) setSelectedContact(null);
    } catch {
      alert('Failed to update contact status');
    }
  };

  const handleDelete = async (c: any) => {
    if (!window.confirm(`Delete contact message from "${c.name}"?`)) return;
    try {
      await AdminApi.deleteContact(c.id);
      loadContacts();
      if (selectedContact?.id === c.id) setSelectedContact(null);
    } catch {
      alert('Failed to delete contact');
    }
  };

  return (
    <div>
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <h2>Contact Inquiries</h2>
            <p>All messages submitted through the public Contact form</p>
          </div>
          <div className="table-actions">
            <select
              className="form-control"
              style={{ width: 'auto', padding: '8px 14px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : contacts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
            No contact inquiries found.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message Preview</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>{c.email}</div>
                    {c.phone && <div style={{ fontSize: '0.75rem', color: '#718096' }}>{c.phone}</div>}
                  </td>
                  <td style={{ fontWeight: 500, color: '#2D3748' }}>{c.subject || '—'}</td>
                  <td style={{ color: '#718096', fontSize: '0.85rem', maxWidth: '240px' }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '220px' }}>
                      {c.message}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${badgeClass(c.status)}`}>{c.status}</span>
                  </td>
                  <td style={{ color: '#718096', fontSize: '0.82rem' }}>
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setSelectedContact(c)}>
                        <Eye size={13} /> View
                      </button>
                      <select
                        className="form-control"
                        style={{ padding: '5px 8px', fontSize: '0.78rem', width: 'auto' }}
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      >
                        <option value="NEW">New</option>
                        <option value="READ">Read</option>
                        <option value="REPLIED">Replied</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                      <button className="btn btn-danger-outline btn-sm" onClick={() => handleDelete(c)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contact Message from {selectedContact.name}</h3>
              <button onClick={() => setSelectedContact(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#718096' }}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-row" style={{ marginBottom: '16px' }}>
                <div><strong>Name:</strong> {selectedContact.name}</div>
                <div>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${selectedContact.email}`} style={{ color: '#0D5C63' }}>{selectedContact.email}</a>
                </div>
              </div>
              {selectedContact.phone && (
                <div style={{ marginBottom: '12px' }}><strong>Phone:</strong> {selectedContact.phone}</div>
              )}
              {selectedContact.subject && (
                <div style={{ marginBottom: '12px' }}><strong>Subject:</strong> {selectedContact.subject}</div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <strong>Message:</strong>
                <p style={{ marginTop: '8px', padding: '14px', background: '#F8FAFC', borderRadius: '10px', fontSize: '0.92rem', color: '#4A5568', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                  {selectedContact.message}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your Inquiry'}`}
                  className="btn btn-primary btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <Mail size={14} /> Reply via Email
                </a>
                <button className="btn btn-outline btn-sm" onClick={() => handleStatusChange(selectedContact.id, 'READ')}>
                  <CheckCircle size={14} /> Mark as Read
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => handleStatusChange(selectedContact.id, 'REPLIED')}>
                  <Reply size={14} /> Mark as Replied
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => handleStatusChange(selectedContact.id, 'ARCHIVED')}>
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
