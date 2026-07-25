import {
  Activity,
  BookOpen,
  Brain,
  Dumbbell,
  Droplet,
  Moon,
  Sun,
  Heart,
  PenLine,
  Music,
  Coffee,
  Bike,
  Utensils,
  Smile,
  Footprints,
  Waves,
  Flame,
  Leaf,
  Guitar,
  Palette,
  Code,
  Briefcase,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  activity: Activity,
  'book-open': BookOpen,
  brain: Brain,
  dumbbell: Dumbbell,
  droplet: Droplet,
  moon: Moon,
  sun: Sun,
  heart: Heart,
  'pen-line': PenLine,
  music: Music,
  coffee: Coffee,
  bike: Bike,
  utensils: Utensils,
  smile: Smile,
  footprints: Footprints,
  waves: Waves,
  flame: Flame,
  leaf: Leaf,
  guitar: Guitar,
  palette: Palette,
  code: Code,
  briefcase: Briefcase,
  users: Users,
};

export const ICON_NAMES = Object.keys(ICON_REGISTRY);

export function getIcon(name: string): LucideIcon {
  return ICON_REGISTRY[name] ?? Activity;
}
