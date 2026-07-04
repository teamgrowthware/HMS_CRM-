import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import Deals from './pages/Deals';
import Contacts from './pages/Contacts';
import Organizations from './pages/Organizations';
import Notes from './pages/Notes';
import Tasks from './pages/Tasks';
import Calls from './pages/Calls';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/email-templates" element={<PlaceholderPage title="Email Templates" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
