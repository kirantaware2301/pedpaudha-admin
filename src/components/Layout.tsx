import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return { title: 'Dashboard Overview', desc: 'Real-time performance metrics and submissions' };
      case '/programs': return { title: 'Programs Management', desc: 'Add, update, or deactivate public NGO programs' };
      case '/events': return { title: 'Events Management', desc: 'Create, edit, and publish public NGO events' };
      case '/volunteers': return { title: 'Volunteer Applications ("Get Involved")', desc: 'Review, approve, and manage community volunteers' };
      case '/contacts': return { title: 'Contact Inquiries', desc: 'Inquiries and messages from public website users' };
      case '/donations': return { title: 'Donations Tracking', desc: 'Contributions and community support records' };
      default:
        if (location.pathname === '/events/new' || location.pathname.startsWith('/events/')) {
          return { title: 'Event Editor', desc: 'Update event details shown on the public NGO website' };
        }
        return { title: 'Admin Panel', desc: 'Uday Foundation NGO' };
    }
  };

  const { title, desc } = getPageTitle();

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-title-box">
            <h1>{title}</h1>
            <p>{desc}</p>
          </div>
        </header>

        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
