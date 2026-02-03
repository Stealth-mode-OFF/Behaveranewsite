import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { useModal } from '../ModalContext';
import { X, Play } from 'lucide-react';

export function DemoVideoModal() {
  const { isVideoOpen, closeVideo } = useModal();

  return (
    <Dialog open={isVideoOpen} onOpenChange={closeVideo}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-brand-text-primary overflow-hidden border-none text-white">
        <DialogTitle className="sr-only">Product Demo</DialogTitle>
        <DialogDescription className="sr-only">Demo video player</DialogDescription>
        <button 
            onClick={closeVideo}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
        <div className="aspect-video w-full bg-brand-text-secondary relative flex items-center justify-center">
          <div className="text-center">
             <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Play className="w-6 h-6 text-white ml-1" />
             </div>
             <p className="text-white/60 font-medium">[Video Player Placeholder]</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
