// ScrollToTop.js — A floating button that appears after the user scrolls
// down a bit, letting them jump back to the top of the page instantly.

import { useState, useEffect } from 'react';

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      className="scroll-to-top"
      onClick={scrollUp}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <span>↑</span>
    </button>
  );
}

export default ScrollToTop;