import React, { useEffect, useState } from 'react';

/**
 * Scroll Progress Indicator
 * Shows reading progress at the top of the page
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
      setProgress(scrollPercent);
    };

    // Initial calculation
    updateProgress();

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary transition-transform duration-100 ease-linear origin-left"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
