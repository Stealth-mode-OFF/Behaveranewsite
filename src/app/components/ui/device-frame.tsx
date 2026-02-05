import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './utils';

interface DeviceFrameProps {
  children: React.ReactNode;
  type?: 'macbook' | 'ipad' | 'iphone';
  className?: string;
}

/**
 * DeviceFrame - Apple-style device mockup
 * Creates "object of desire" effect for product screenshots
 */
export function DeviceFrame({ 
  children, 
  type = 'macbook', 
  className
}: DeviceFrameProps) {
  if (type === 'ipad') {
    return (
      <div className={cn("relative", className)}>
        {/* iPad Pro Frame - Portrait Orientation */}
        <div className="relative bg-[#1a1a1a] rounded-[24px] p-[10px] shadow-2xl">
          {/* Outer frame gradient for depth */}
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] opacity-50" />
          
          {/* Inner bezel */}
          <div className="relative bg-[#0a0a0a] rounded-[16px] p-[6px]">
            {/* Front camera (centered at top for portrait) */}
            <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#2a2a2a] z-10 border border-[#3a3a3a]">
              <div className="absolute inset-[2px] rounded-full bg-[#1a1a2a]" />
            </div>
            
            {/* Screen */}
            <div className="relative rounded-[12px] overflow-hidden bg-white">
              {children}
            </div>
          </div>
          
          {/* Side buttons - volume (left side) */}
          <div className="absolute left-[-2px] top-[80px] w-[2px] h-[28px] bg-[#3a3a3a] rounded-l-sm" />
          <div className="absolute left-[-2px] top-[116px] w-[2px] h-[28px] bg-[#3a3a3a] rounded-l-sm" />
          
          {/* Power button (right side) */}
          <div className="absolute right-[-2px] top-[80px] w-[2px] h-[40px] bg-[#3a3a3a] rounded-r-sm" />
        </div>
      </div>
    );
  }
  
  if (type === 'macbook') {
    return (
      <div className={cn("relative", className)}>
        {/* MacBook Pro Frame */}
        <div className="relative">
          {/* Screen bezel */}
          <div className="relative bg-[#1a1a1a] rounded-t-[16px] p-[8px] pb-0">
            {/* Camera notch */}
            <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#3a3a3a]" />
            
            {/* Screen */}
            <div className="relative rounded-t-[8px] overflow-hidden bg-white">
              {children}
            </div>
          </div>
          
          {/* MacBook bottom/keyboard area */}
          <div className="relative">
            {/* Hinge */}
            <div className="h-[12px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-[2px]" />
            
            {/* Base */}
            <div className="h-[8px] bg-gradient-to-b from-[#d4d4d4] to-[#a8a8a8] rounded-b-[8px] mx-[-4%] shadow-lg" />
            
            {/* Notch cutout in base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20%] h-[4px] bg-[#2a2a2a] rounded-b-[4px]" />
          </div>
        </div>
      </div>
    );
  }
  
  return <div className={className}>{children}</div>;
}

/**
 * iPad Pro Frame - Standalone component for carousel use
 */
export function IPadProFrame({ 
  children,
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* iPad Pro 13" Frame - Portrait */}
      <div className="relative bg-gradient-to-b from-[#2d2d2d] to-[#1a1a1a] rounded-[28px] p-[12px] shadow-[0_25px_80px_-15px_rgba(0,0,0,0.5)]">
        {/* Metallic edge highlight */}
        <div className="absolute inset-0 rounded-[28px] border border-[#4a4a4a]/30" />
        
        {/* Inner bezel */}
        <div className="relative bg-[#0a0a0a] rounded-[18px] p-[8px]">
          {/* Front camera */}
          <div className="absolute top-[16px] left-1/2 -translate-x-1/2 z-10">
            <div className="w-[10px] h-[10px] rounded-full bg-[#1a1a2a] border border-[#3a3a3a] shadow-inner">
              <div className="absolute inset-[3px] rounded-full bg-[#0f0f1a]" />
            </div>
          </div>
          
          {/* Screen container */}
          <div className="relative rounded-[12px] overflow-hidden bg-black">
            {children}
          </div>
        </div>
        
        {/* Volume buttons - left side */}
        <div className="absolute left-[-3px] top-[100px] w-[3px] h-[32px] bg-gradient-to-r from-[#4a4a4a] to-[#3a3a3a] rounded-l-[2px]" />
        <div className="absolute left-[-3px] top-[140px] w-[3px] h-[32px] bg-gradient-to-r from-[#4a4a4a] to-[#3a3a3a] rounded-l-[2px]" />
        
        {/* Power button - top right area */}
        <div className="absolute right-[-3px] top-[100px] w-[3px] h-[44px] bg-gradient-to-l from-[#4a4a4a] to-[#3a3a3a] rounded-r-[2px]" />
      </div>
    </div>
  );
}

/**
 * Animated Dashboard Content for Device Frame
 */
export function AnimatedDashboardContent({ 
  imageSrc,
  imageAlt = "Dashboard"
}: { 
  imageSrc: string;
  imageAlt?: string;
}) {
  return (
    <motion.img
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      src={imageSrc}
      alt={imageAlt}
      className="w-full h-auto block"
      loading="eager"
    />
  );
}
