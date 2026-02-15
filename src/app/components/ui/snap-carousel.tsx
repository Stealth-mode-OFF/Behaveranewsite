import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/app/components/ui/utils";
import { IPadProFrame } from "@/app/components/ui/device-frame";

interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  description: string;
  badge?: string;
}

interface SnapCarouselProps {
  slides: CarouselSlide[];
  autoplayInterval?: number;
  className?: string;
  onSlideClick?: () => void;
}

/**
 * Snap Carousel V2 - iPad Pro Level Design
 * 
 * Features:
 * - Horizontal snap-scroll with CSS scroll-snap
 * - Elegant navigation dots with progress indicator
 * - Autoplay with pause on hover
 * - Keyboard navigation
 * - Touch/swipe friendly
 * - Smooth spring animations
 */
export function SnapCarousel({ 
  slides, 
  autoplayInterval = 5000,
  className,
  onSlideClick 
}: SnapCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Handle scroll to detect current slide
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.clientWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    
    const interval = setInterval(() => {
      goToSlide((activeIndex + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, isAutoPlaying, isHovered, slides.length, autoplayInterval]);

  const goToSlide = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: 'smooth'
    });
  };

  const goNext = () => goToSlide((activeIndex + 1) % slides.length);
  const goPrev = () => goToSlide((activeIndex - 1 + slides.length) % slides.length);

  // Keyboard navigation
  const handleKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === ' ') {
      e.preventDefault();
      setIsAutoPlaying(!isAutoPlaying);
    }
  };

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image carousel"
      aria-roledescription="carousel"
    >
      {/* Main Carousel Container */}
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="flex-none w-full snap-center flex justify-center items-start py-4 px-4"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
          <div className="relative group/slide w-full max-w-[380px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[750px]">
              {/* iPad Pro Frame */}
              <IPadProFrame>
                {/* Badge */}
                {slide.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 left-4 z-20"
                  >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full border border-brand-border/30 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-text-secondary">
                        {slide.badge}
                      </span>
                    </span>
                  </motion.div>
                )}

                {/* Image */}
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-auto block"
                  width={1500}
                  height={2000}
                  loading="lazy"
                  decoding="async"
                  onClick={onSlideClick}
                  style={{ cursor: onSlideClick ? 'pointer' : 'default' }}
                />
              </IPadProFrame>

              {/* Slide Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: activeIndex === index ? 1 : 0.5, y: 0 }}
                className="mt-8 text-center px-4"
              >
                <h3 className="text-xl font-bold text-brand-text-primary mb-2">
                  {slide.title}
                </h3>
                <p className="text-brand-text-secondary max-w-lg mx-auto">
                  {slide.description}
                </p>
              </motion.div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button" aria-label="Previous" onClick={goPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-brand-border/30 flex items-center justify-center text-brand-text-secondary hover:text-brand-primary hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button" aria-label="Next" onClick={goNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-brand-border/30 flex items-center justify-center text-brand-text-secondary hover:text-brand-primary hover:bg-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Navigation with Progress */}
      <div className="flex items-center justify-center gap-3 mt-8">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button" aria-label={`Go to slide ${index + 1}`} onClick={() => goToSlide(index)}
              className={cn(
                "relative w-2 h-2 rounded-full transition-all duration-300",
                activeIndex === index
                  ? "w-8 bg-brand-primary"
                  : "bg-brand-border hover:bg-brand-text-muted"
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : 'false'}
            >
              {/* Progress indicator for active slide */}
              {activeIndex === index && isAutoPlaying && !isHovered && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: autoplayInterval / 1000, ease: "linear" }}
                  className="absolute inset-0 bg-brand-accent rounded-full origin-left"
                  key={`progress-${index}-${activeIndex}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Play/Pause button */}
        <button
          type="button" aria-label={isAutoPlaying ? "Pause" : "Play"} onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-8 h-8 rounded-full border border-brand-border flex items-center justify-center text-brand-text-muted hover:text-brand-primary hover:border-brand-primary transition-all"
          aria-label={isAutoPlaying ? "Pause autoplay" : "Resume autoplay"}
        >
          {isAutoPlaying ? (
            <Pause className="w-3 h-3" />
          ) : (
            <Play className="w-3 h-3 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Simple Feature Card Grid for below carousel
 */
interface FeatureGridProps {
  features: Array<{
    icon: ReactNode;
    title: string;
    description: string;
  }>;
}

export function FeatureGrid({ features }: FeatureGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 border-t border-brand-border pt-12 md:pt-16">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex gap-6 items-start group"
        >
          <div className="w-14 h-14 rounded-xl bg-brand-background-secondary border border-brand-border flex items-center justify-center shrink-0 text-brand-primary shadow-sm mt-1 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all duration-300">
            {feature.icon}
          </div>
          <div>
            <h3 className="font-bold text-brand-text-primary mb-3 text-lg group-hover:text-brand-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-base text-brand-text-secondary leading-relaxed">
              {feature.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
