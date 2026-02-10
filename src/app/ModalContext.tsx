import { createContext, useContext, useState, type ReactNode } from 'react';
import { trackBookingOpen, trackBookingClose } from '@/lib/analytics';

interface ModalContextType {
  isBookingOpen: boolean;
  openBooking: (locationOrEvent?: string | unknown) => void;
  closeBooking: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openBooking = (locationOrEvent?: string | unknown) => {
    setIsBookingOpen(true);
    // Only track if a real string location was provided (not a MouseEvent)
    const location = typeof locationOrEvent === 'string' ? locationOrEvent : 'unknown';
    trackBookingOpen(location);
  };
  const closeBooking = () => {
    setIsBookingOpen(false);
    trackBookingClose();
  };

  return (
    <ModalContext.Provider
      value={{
        isBookingOpen,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    // Fallback for independent component rendering
    const fallback: ModalContextType = {
      isBookingOpen: false,
      openBooking: () => {},
      closeBooking: () => {},
    };
    return fallback;
  }
  return context;
}
