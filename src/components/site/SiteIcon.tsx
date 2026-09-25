import {
  Award,
  BadgeCheck,
  BookOpen,
  Calendar,
  Camera,
  CreditCard,
  Flag,
  Gift,
  Globe,
  Headphones,
  Heart,
  Mail,
  MapPin,
  Medal,
  MessageCircle,
  Package,
  Phone,
  Quote,
  RefreshCw,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  Truck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Target,
  Flag,
  Timer,
  Trophy,
  Medal,
  Truck,
  ShieldCheck,
  RefreshCw,
  Headphones,
  ShoppingBag,
  Camera,
  Globe,
  Mail,
  MapPin,
  Phone,
  Gift,
  Send,
  Quote,
  Star,
  Heart,
  Zap,
  Award,
  BookOpen,
  Users,
  Calendar,
  MessageCircle,
  CreditCard,
  Package,
  BadgeCheck,
};

export default function SiteIcon({
  name,
  size = 22,
  strokeWidth = 1.7,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? Flag;
  return <Icon size={size} strokeWidth={strokeWidth} />;
}
