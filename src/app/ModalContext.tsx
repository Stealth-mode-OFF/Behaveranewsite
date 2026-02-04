import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isBookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
  isVideoOpen: boolean;
  openVideo: () => void;
  closeVideo: () => void;
  demoRequestOpen: boolean;
  openDemoRequest: () => void;
  closeDemoRequest: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [demoRequestOpen, setDemoRequestOpen] = useState(false);

  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);
  const openVideo = () => setIsVideoOpen(true);
  const closeVideo = () => setIsVideoOpen(false);
  const openDemoRequest = () => setDemoRequestOpen(true);
  const closeDemoRequest = () => setDemoRequestOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isBookingOpen,
        openBooking,
        closeBooking,
        isVideoOpen,
        openVideo,
        closeVideo,
        demoRequestOpen,
        openDemoRequest,
        closeDemoRequest,
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
    return {
      isBookingOpen: false,
      openBooking: () => {},
      closeBooking: () => {},
      isVideoOpen: false,
      openVideo: () => {},
      closeVideo: () => {},
      demoRequestOpen: false,
      openDemoRequest: () => {},
      closeDemoRequest: () => {}
    };
  }
  return context;
}
