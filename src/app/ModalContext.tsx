import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isBookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
  isVideoOpen: boolean;
  openVideo: () => void;
  closeVideo: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);
  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);

  return (
    <ModalContext.Provider value={{ isBookingOpen, openBooking, closeBooking, isVideoOpen, openVideo, closeVideo }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    // Fallback for independent component rendering
    return {
      isBookingOpen: false,
      openBooking: () => {},
      closeBooking: () => {},
      isVideoOpen: false,
      openVideo: () => {},
      closeVideo: () => {}
    };
  }
  return context;
}
