import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { useModal } from '../ModalContext';
import { X } from 'lucide-react';

export function DemoVideoModal() {
  const { isVideoOpen, closeVideo } = useModal();

  return (
    <Dialog open={isVideoOpen} onOpenChange={closeVideo}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-black overflow-hidden border-none text-white">
        <DialogTitle className="sr-only">Product Demo</DialogTitle>
        <DialogDescription className="sr-only">Demo video player</DialogDescription>
        <button 
            onClick={closeVideo}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
        <div className="aspect-video w-full bg-slate-900 relative">
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
             [Video Player Placeholder]
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
