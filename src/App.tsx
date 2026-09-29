import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OverviewPage } from './pages/OverviewPage';
import { ProgramsManagerPage } from './pages/ProgramsManagerPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { ContactInquiriesPage } from './pages/ContactInquiriesPage';
import { DonationsPage } from './pages/DonationsPage';
import { EventsManagerPage } from './pages/EventsManagerPage';
import { EventEditPage } from './pages/EventEditPage';
import { EventRegistrationsPage } from './pages/EventRegistrationsPage';
import { LoginPage } from './pages/LoginPage';
import { hasAdminSession } from './services/adminApi';
import './styles/admin.css';

const ProtectedLayout: React.FC = () => {
  const location = useLocation();
  return hasAdminSession()
    ? <Layout />
    : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="programs" element={<ProgramsManagerPage />} />
          <Route path="events" element={<EventsManagerPage />} />
          <Route path="events/new" element={<EventEditPage />} />
          <Route path="events/:id/edit" element={<EventEditPage />} />
          <Route path="events/:id/registrations" element={<EventRegistrationsPage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="contacts" element={<ContactInquiriesPage />} />
          <Route path="donations" element={<DonationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
