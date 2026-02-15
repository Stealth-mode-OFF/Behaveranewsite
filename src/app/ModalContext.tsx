import { createContext, useContext, useState, type ReactNode } from 'react';
import { trackBookingOpen, trackBookingClose } from '@/lib/analytics';

interface ModalContextType {
  isBookingOpen: boolean;
  openBooking: (locationOrEvent?: string | unknown) => void;
  closeBooking: () => void;
  isDemoOpen: boolean;
  openDemo: (locationOrEvent?: string | unknown) => void;
  closeDemo: () => void;
  isSignupOpen: boolean;
  openSignup: (locationOrEvent?: string | unknown) => void;
  closeSignup: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const openBooking = (locationOrEvent?: string | unknown) => {
    setIsBookingOpen(true);
    const location = typeof locationOrEvent === 'string' ? locationOrEvent : 'unknown';
    trackBookingOpen(location);
  };
  const closeBooking = () => {
    setIsBookingOpen(false);
    trackBookingClose();
  };

  const openDemo = (locationOrEvent?: string | unknown) => {
    setIsDemoOpen(true);
    const location = typeof locationOrEvent === 'string' ? locationOrEvent : 'unknown';
    trackBookingOpen(`demo_${location}`);
  };
  const closeDemo = () => {
    setIsDemoOpen(false);
    trackBookingClose();
  };

  const openSignup = (locationOrEvent?: string | unknown) => {
    setIsSignupOpen(true);
    const location = typeof locationOrEvent === 'string' ? locationOrEvent : 'unknown';
    trackBookingOpen(`signup_${location}`);
  };
  const closeSignup = () => {
    setIsSignupOpen(false);
    trackBookingClose();
  };

  return (
    <ModalContext.Provider
      value={{
        isBookingOpen,
        openBooking,
        closeBooking,
        isDemoOpen,
        openDemo,
        closeDemo,
        isSignupOpen,
        openSignup,
        closeSignup,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    const fallback: ModalContextType = {
      isBookingOpen: false,
      openBooking: () => {},
      closeBooking: () => {},
      isDemoOpen: false,
      openDemo: () => {},
      closeDemo: () => {},
      isSignupOpen: false,
      openSignup: () => {},
      closeSignup: () => {},
    };
    return fallback;
  }
  return context;
}
