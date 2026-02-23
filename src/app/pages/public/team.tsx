import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/app/contexts/language-context';
import { Header } from '@/app/components/layout/header';
import { Footer } from '@/app/components/layout/footer';
import { useSEO } from '@/app/hooks/use-seo';
import { SITE_ORIGIN } from '@/lib/urls';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Linkedin, 
  MapPin, 
  Briefcase,
  GraduationCap,
  Heart,
  Quote,
  X,
} from 'lucide-react';

// Team member images
import igorImg from '@/assets/team/igor.webp';
import dusanImg from '@/assets/team/dusan.webp';
import janaImg from '@/assets/team/jana.webp';
import veronikaImg from '@/assets/team/veronika.webp';
import josefImg from '@/assets/team/josef.webp';