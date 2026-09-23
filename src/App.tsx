import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { OverviewPage } from './pages/OverviewPage';
import { ProgramsManagerPage } from './pages/ProgramsManagerPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { ContactInquiriesPage } from './pages/ContactInquiriesPage';
import { DonationsPage } from './pages/DonationsPage';
import './styles/admin.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<OverviewPage />} />
          <Route path="programs" element={<ProgramsManagerPage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="contacts" element={<ContactInquiriesPage />} />
          <Route path="donations" element={<DonationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
