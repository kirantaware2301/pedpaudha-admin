import React, { useEffect, useState } from 'react';
import { AdminApi } from '../services/adminApi';
import { 
  FolderKanban, 
  Users, 
  Mail, 
  IndianRupee, 
  ArrowUpRight, 
  Clock, 
  HeartHandshake 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [recentVolunteers, setRecentVolunteers] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ovData, volData, contData] = await Promise.all([
        AdminApi.getOverview(),
        AdminApi.getVolunteers(),
        AdminApi.getContacts()
      ]);
      setOverview(ovData);
      setRecentVolunteers(volData.slice(0, 5));
      setRecentContacts(contData.slice(0, 5));
    } catch (err) {
      console.error('Failed to load overview data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-indicator" style={{ minHeight: '300px' }}>
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>Active Programs</h3>
            <div className="stat-number">{overview?.activePrograms || 0}</div>
            <div className="stat-sub">of {overview?.totalPrograms || 0} total registered</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#2563EB' }}>
            <FolderKanban size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Volunteers Applied</h3>
            <div className="stat-number">{overview?.totalVolunteers || 0}</div>
            <div className="stat-sub">
              <span style={{ color: '#D97706', fontWeight: 600 }}>{overview?.pendingVolunteers || 0} pending review</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#FEF3C7', color: '#D97706' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Inquiries Received</h3>
            <div className="stat-number">{overview?.totalContacts || 0}</div>
            <div className="stat-sub">
              <span style={{ color: '#059669', fontWeight: 600 }}>{overview?.newContacts || 0} awaiting reply</span>
            </div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#ECFDF5', color: '#059669' }}>
            <Mail size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Donations Recorded</h3>
            <div className="stat-number">
              ₹{overview?.totalDonationsAmount ? Number(overview.totalDonationsAmount).toLocaleString('en-IN') : '0'}
            </div>
            <div className="stat-sub">{overview?.totalDonors || 0} total donations</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#FDF2F8', color: '#DB2777' }}>
            <IndianRupee size={24} />
          </div>
        </div>
      </div>

      {/* Two Column Grid for Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
        
        {/* Recent Volunteer Submissions */}
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              <h2>Recent Volunteer Signups</h2>
              <p>Users who filled the "Get Involved" form</p>
            </div>
            <Link to="/volunteers" className="btn btn-outline btn-sm">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          {recentVolunteers.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#718096' }}>
              No volunteer applications received yet.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Interest</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentVolunteers.map((vol) => (
                  <tr key={vol.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{vol.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#718096' }}>{vol.email}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{vol.areaOfInterest}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        vol.status === 'ACCEPTED' ? 'badge-success' :
                        vol.status === 'PENDING' ? 'badge-warning' : 'badge-neutral'
                      }`}>
                        {vol.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Contact Inquiries */}
        <div className="table-card">
          <div className="table-header">
            <div className="table-title">
              <h2>Recent Contact Messages</h2>
              <p>Inquiries submitted from public contact page</p>
            </div>
            <Link to="/contacts" className="btn btn-outline btn-sm">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#718096' }}>
              No contact inquiries submitted yet.
            </div>
          ) : (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((cnt) => (
                  <tr key={cnt.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{cnt.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#718096' }}>{cnt.email}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cnt.subject}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        cnt.status === 'RESPONDED' ? 'badge-success' :
                        cnt.status === 'PENDING' ? 'badge-warning' : 'badge-neutral'
                      }`}>
                        {cnt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};
