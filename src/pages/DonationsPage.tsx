import React, { useEffect, useState } from 'react';
import { AdminApi } from '../services/adminApi';
import { IndianRupee, TrendingUp, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

const badgeClass = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'COMPLETED':
    case 'SUCCESS': return 'badge-success';
    case 'FAILED':
    case 'CANCELLED': return 'badge-danger';
    case 'PENDING': return 'badge-warning';
    default: return 'badge-info';
  }
};

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const DonationsPage: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const data = await AdminApi.getDonations();
      setDonations(Array.isArray(data) ? data : data?.content || data?.donations || []);
    } catch (err) {
      console.error('Failed to load donations', err);
    } finally {
      setLoading(false);
    }
  };

  // Compute summary stats
  const completed = donations.filter(d => ['COMPLETED', 'SUCCESS'].includes(d.status?.toUpperCase()));
  const totalRaised = completed.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalDonors = new Set(donations.map(d => d.donorEmail)).size;
  const avgDonation = completed.length > 0 ? totalRaised / completed.length : (donations.length > 0 ? donations.reduce((sum, d) => sum + (d.amount || 0), 0) / donations.length : 0);
  const pending = donations.filter(d => d.status?.toUpperCase() === 'PENDING').length;

  return (
    <div>
      {/* Summary KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-content">
            <h3>Total Raised</h3>
            <div className="stat-number">{formatAmount(totalRaised)}</div>
            <div className="stat-sub">From {completed.length} successful donations</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16,185,129,0.12)' }}>
            <IndianRupee size={24} color="#059669" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Unique Donors</h3>
            <div className="stat-number">{totalDonors}</div>
            <div className="stat-sub">Individual contributors</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(59,130,246,0.12)' }}>
            <Users size={24} color="#2563EB" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Avg. Donation</h3>
            <div className="stat-number">{formatAmount(avgDonation)}</div>
            <div className="stat-sub">Per successful transaction</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(232,168,56,0.12)' }}>
            <TrendingUp size={24} color="#D48F19" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>Pending</h3>
            <div className="stat-number">{pending}</div>
            <div className="stat-sub">Awaiting paymentt confirmation</div>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245,158,11,0.12)' }}>
            <Clock size={24} color="#D97706" />
          </div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="table-card">
        <div className="table-header">
          <div className="table-title">
            <h2>All Donations</h2>
            <p>Complete record of all donation transactions</p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={loadDonations}>
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        ) : donations.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#718096' }}>
            <IndianRupee size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p>No donations recorded yet.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Donor</th>
                <th>Amount</th>
                <th>Cause / Program</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{d.donorName || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.78rem', color: '#718096' }}>{d.donorEmail}</div>
                    {d.donorPhone && (
                      <div style={{ fontSize: '0.75rem', color: '#718096' }}>{d.donorPhone}</div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0D5C63' }}>
                      {formatAmount(d.amount)}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-neutral">
                      {d.dedicatedProgram || d.causeLabel || d.cause || 'General Fund'}
                    </span>
                  </td>
                  <td style={{ color: '#4A5568', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                    {d.paymentMethod || '—'}
                  </td>
                  <td>
                    <span className={`badge ${badgeClass(d.status)}`}>
                      {d.status || 'Unknown'}
                    </span>
                  </td>
                  <td style={{ color: '#718096', fontSize: '0.82rem' }}>
                    {d.createdAt
                      ? new Date(d.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td style={{ color: '#A0AEC0', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    {d.razorpayPaymentId || d.transactionId || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
