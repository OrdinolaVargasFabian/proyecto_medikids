import { Outlet } from 'react-router-dom';
import { Navbar } from '../features/landing/components/Navbar';
import { Footer } from '../features/landing/components/Footer';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-transparent selection:bg-medi-200/50 selection:text-medi-900">
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
};
