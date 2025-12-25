'use client';

import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Benefits from './components/Benefits';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

export default function Home() {
  const showTrackingModal = () => {
    // Implement tracking modal
    alert('Tracking modal - to be implemented');
  };

  const showOrderModal = () => {
    // Implement order modal
    alert('Order modal - to be implemented');
  };

  return (
    <div className="bg-gray-50">
      <Header showTrackingModal={showTrackingModal} showOrderModal={showOrderModal} />
      <Hero showTrackingModal={showTrackingModal} showOrderModal={showOrderModal} />
      <Services showOrderModal={showOrderModal} />
      <Benefits />
      <About showOrderModal={showOrderModal} />
      <Testimonials />
      <Contact />
      <CTA showTrackingModal={showTrackingModal} showOrderModal={showOrderModal} />
      <Footer />
      <ScrollToTop />
    </div>
  );
}