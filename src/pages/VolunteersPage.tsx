import React, { useEffect, useState } from 'react';
import { AdminApi } from '../services/adminApi';
import { Trash2, ChevronDown, Eye, CheckCircle, XCircle, Phone } from 'lucide-react';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED'];

const badgeClass = (status: string) => {
  switch (status) {
    case 'ACCEPTED': return 'badge-success';
    case 'REJECTED': return 'badge-danger';
    case 'UNDER_REVIEW': return 'badge-info';
    default: return 'badge-warning';
  }
};

export const VolunteersPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVol, setSelectedVol] = useState<any | null>(null);

  useEffect(() => {
    loadVolunteers();
  }, [statusFilter]);

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      const data = await AdminApi.getVolunteers(statusFilter);
      setVolunteers(data);
    } catch (err) {
      console.error('Failed to load volunteers', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await AdminApi.updateVolunteerStatus(id, status);
      loadVolunteers();
      if (selectedVol?.id === id) {
        setSelectedVol(null);
      }
    } catch {
      alert('Failed to update volunteer status');
    }
  };

  const handleDelete = async (vol: any) => {
    if (!window.confirm(`Delete application from "${vol.name}"? This cannot be undone.`)) return;
    try {
      await AdminApi.deleteVolunteer(vol.id);
      loadVolunteers();
      if (selectedVol?.id === vol.id) setSelectedVol(null);
    } catch {
      alert('Failed to delete volunteer');
    }
  };

  return (
    <div>
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <h2>Volunteer Applications ("Get Involved")</h2>
            <p>All submissions from the public "Get Involved" form</p>
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
          <div style={{ padding: '36px', textAlign: 'center' }}>Loading volunteer applications...</div>
        ) : volunteers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
            No volunteer applications found.
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Area of Interest</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Applied At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{vol.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>{vol.email}</div>
                    {vol.phone && (
                      <div style={{ fontSize: '0.75rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={11} /> {vol.phone}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-neutral">{vol.areaOfInterest}</span>
                  </td>
                  <td style={{ color: '#4A5568', fontSize: '0.85rem' }}>{vol.availability || '—'}</td>
                  <td>
                    <span className={`badge ${badgeClass(vol.status)}`}>{vol.status}</span>
                  </td>
                  <td style={{ color: '#718096', fontSize: '0.82rem' }}>
                    {vol.appliedAt ? new Date(vol.appliedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setSelectedVol(vol)}>
                        <Eye size={13} /> View
                      </button>
                      <select
                        className="form-control"
                        style={{ padding: '5px 8px', fontSize: '0.78rem', width: 'auto' }}
                        value={vol.status}
                        onChange={(e) => handleStatusChange(vol.id, e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ACCEPTED">Accept</option>
                        <option value="REJECTED">Reject</option>
                      </select>
                      <button className="btn btn-danger-outline btn-sm" onClick={() => handleDelete(vol)}>
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
      {selectedVol && (
        <div className="modal-overlay" onClick={() => setSelectedVol(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Volunteer Application: {selectedVol.name}</h3>
              <button onClick={() => setSelectedVol(null)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#718096' }}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-row" style={{ marginBottom: '16px' }}>
                <div><strong>Name:</strong> {selectedVol.name}</div>
                <div><strong>Email:</strong> {selectedVol.email}</div>
              </div>
              <div className="form-row" style={{ marginBottom: '16px' }}>
                <div><strong>Phone:</strong> {selectedVol.phone || '—'}</div>
                <div><strong>City:</strong> {selectedVol.city || '—'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}><strong>Occupation:</strong> {selectedVol.occupation || '—'}</div>
              <div style={{ marginBottom: '12px' }}><strong>Area of Interest:</strong> <span className="badge badge-neutral">{selectedVol.areaOfInterest}</span></div>
              <div style={{ marginBottom: '12px' }}><strong>Availability:</strong> {selectedVol.availability || '—'}</div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Motivation:</strong>
                <p style={{ marginTop: '6px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '0.9rem', color: '#4A5568' }}>
                  {selectedVol.motivation || 'Not provided'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => { handleStatusChange(selectedVol.id, 'ACCEPTED'); }}>
                  <CheckCircle size={14} /> Accept
                </button>
                <button className="btn btn-danger-outline btn-sm" onClick={() => { handleStatusChange(selectedVol.id, 'REJECTED'); }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
