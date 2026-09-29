import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  UserCheck, 
  Mail, 
  HeartHandshake, 
  ExternalLink,
  ShieldAlert,
  Calendar,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearAdminSession } from '../services/adminApi';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="brand-badge">
          <ShieldAlert size={26} color="#E8A838" />
          <span>Uday</span> Admin
        </NavLink>
        <div className="brand-subtitle">NGO Management Portal</div>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={19} />
          Overview
        </NavLink>

        <NavLink 
          to="/programs" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <FolderKanban size={19} />
          Programs Manager
        </NavLink>

        <NavLink 
          to="/volunteers" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <UserCheck size={19} />
          Volunteer Applications
        </NavLink>

        <NavLink 
          to="/contacts" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Mail size={19} />
          Contact Inquiries
        </NavLink>

        <NavLink 
          to="/events" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <Calendar size={19} />
          Events Manager
        </NavLink>

        <NavLink 
          to="/donations" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <HeartHandshake size={19} />
          Donations
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" type="button" onClick={handleLogout}>
          <LogOut size={16} />
          Sign out
        </button>
        <a 
          href="http://localhost:5174" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="public-link-btn"
        >
          <ExternalLink size={16} />
          View Public NGO Site
        </a>
      </div>
    </aside>
  );
};
