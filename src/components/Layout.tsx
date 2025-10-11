import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16"> {/* Added padding for Navbar and Footer */}
        <Outlet /> {/* This is where child routes will render */}
      </main>
      <Footer />
    </div>
  );
}