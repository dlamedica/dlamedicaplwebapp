import React from 'react';
import {
  Phone,
  Lock,
  ExternalLink,
  Camera,
  File,
  
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Heart,
  Eye,
  ArrowLeftRight,
  ShoppingCart,
  Check,
  FileText,
  CheckCircle,
  Star,
  Zap,
  Tag,
  X,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  MapPin,
  ArrowUpDown,
  Trophy,
  Clock,
  BarChart2,
  Video,
  Building,
  Home,
  Flame,
  Share2,
  Copy,
  Mail,
  Users,
  Book,
  Trash2,
  Plus,
  PieChart,
  Bell,
  Download,
  Link,
  MessageCircle,
  MoreHorizontal,
  GraduationCap,
  User,
  Stethoscope,
  Award,
  BookOpen,
  Briefcase,
  TrendingUp,
  Settings,
  LogOut,
  Edit,
  Loader2,
  FileCheck,
  Building2,
  Menu,
  MoreVertical,
  Activity,
  Shield,
  CreditCard,
  Truck,
  Package,
  Info,
  Badge,
  Medal,
  Globe,
  Map,
  Lightbulb
} from 'lucide-react';

import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaGoogle,
  FaApple
} from 'react-icons/fa';

// Typy dla ikon
export interface IconProps {
  size?: number | string;
  color?: string;
  className?: string;
  fill?: string; // Do kompatybilności
  strokeWidth?: number;
}

// Helper do renderowania ikon Lucide z propsami aplikacji
const createIcon = (IconComponent: any) => ({ size = 24, color = 'currentColor', className = '', ...props }: IconProps) => (
  <IconComponent size={size} color={color} className={className} {...props} />
);

// --- NAVIGATION & UI ---
export const HomeIcon = createIcon(Home);
export const SearchIcon = createIcon(Search);
export const FilterIcon = createIcon(Filter);
export const SortIcon = createIcon(ArrowUpDown);
export const MenuIcon = createIcon(Menu);
export const MoreHorizontalIcon = createIcon(MoreHorizontal);
export const MoreVerticalIcon = createIcon(MoreVertical);
export const SettingsIcon = createIcon(Settings);
export const CloseIcon = createIcon(X);
export const CheckIcon = createIcon(Check);
export const CheckCircleIcon = createIcon(CheckCircle);
export const ErrorIcon = createIcon(AlertCircle);
export const InfoIcon = createIcon(Info);
export const AlertIcon = createIcon(AlertCircle);
export const TrashIcon = createIcon(Trash2);
export const PlusIcon = createIcon(Plus);
export const EditIcon = createIcon(Edit);
export const SaveIcon = createIcon(Check); // Save often uses check or floppy disk. Check is safe for "saved".
export const CancelIcon = createIcon(X);
export const LinkIcon = createIcon(Link);
export const CopyIcon = createIcon(Copy);
export const ShareIcon = createIcon(Share2);
export const DownloadIcon = createIcon(Download);
export const UploadIcon = createIcon(ArrowUpDown); // Placeholder or generic
export const LoginIcon = createIcon(LogOut); // Wait, Login usually isn't Logout.
export const LogoutIcon = createIcon(LogOut);

// --- ARROWS ---
export const ArrowRightIcon = createIcon(ArrowRight);
export const ArrowLeftIcon = createIcon(ArrowLeft);
export const ChevronDownIcon = createIcon(ChevronDown);
export const ChevronUpIcon = createIcon(ChevronUp);
export const ChevronLeftIcon = createIcon(ChevronLeft);
export const ChevronRightIcon = createIcon(ChevronRight);
export const ChevronsLeftIcon = createIcon(ChevronsLeft);
export const ChevronsRightIcon = createIcon(ChevronsRight);

// --- COMMERCE & SHOP ---
export const CartIcon = createIcon(ShoppingCart);
export const HeartIcon = createIcon(Heart);
export const TagIcon = createIcon(Tag);
export const InvoiceIcon = createIcon(FileText);
export const CreditCardIcon = createIcon(CreditCard);
export const TruckIcon = createIcon(Truck);
export const PackageIcon = createIcon(Package);
export const CompareIcon = createIcon(ArrowLeftRight);
export const EyeIcon = createIcon(Eye);

// --- SOCIAL MEDIA ---
export const FacebookIcon = createIcon(FaFacebook);
export const TwitterIcon = createIcon(FaTwitter);
export const WhatsAppIcon = createIcon(FaWhatsapp);
export const GoogleIcon = createIcon(FaGoogle);
export const AppleIcon = createIcon(FaApple);

// --- CONTENT & MEDIA ---
export const StarIcon = createIcon(Star);
export const CalendarIcon = createIcon(Calendar);
export const ClockIcon = createIcon(Clock);
export const LocationIcon = createIcon(MapPin);
export const VideoIcon = createIcon(Video);
export const FireIcon = createIcon(Flame);
export const EmailIcon = createIcon(Mail);
export const BookIcon = createIcon(Book);
export const FileTextIcon = createIcon(FileText);
export const FileCheckIcon = createIcon(FileCheck);
export const MapIcon = createIcon(Map);
export const GlobeIcon = createIcon(Globe);

// --- USERS & ROLES ---
export const UserIcon = createIcon(User);
export const UsersIcon = createIcon(Users);
export const DoctorIcon = createIcon(Stethoscope);
export const StudentIcon = createIcon(GraduationCap);
export const CompanyIcon = createIcon(Building2); // Building2 is more "corporate"
export const BuildingIcon = createIcon(Building);

// --- GAMIFICATION & STATS ---
export const TrophyIcon = createIcon(Trophy);
export const AwardIcon = createIcon(Award);
export const MedalIcon = createIcon(Medal);
export const StatsIcon = createIcon(BarChart2);
export const ChartLineIcon = createIcon(TrendingUp);
export const ChartIcon = createIcon(PieChart);
export const ActivityIcon = createIcon(Activity);
export const BadgeIcon = createIcon(Badge);
export const StreakIcon = createIcon(Flame);
export const PointsIcon = createIcon(Star); // Or coins
export const LevelIcon = createIcon(TrendingUp);
export const RankingIcon = createIcon(BarChart2);
export const CrownIcon = createIcon(Trophy); // close enough

// --- MEDICAL & EDUCATION ---
export const GraduationCapIcon = createIcon(GraduationCap);
export const StethoscopeIcon = createIcon(Stethoscope);
export const ShieldIcon = createIcon(Shield);
export const LearningIcon = createIcon(BookOpen);
export const OverviewIcon = createIcon(Activity);
export const BriefcaseIcon = createIcon(Briefcase);
export const CertificateIcon = createIcon(FileCheck);
export const BoltIcon = createIcon(Zap);
export const InspirationIcon = createIcon(Lightbulb);
export const IdeaIcon = createIcon(Lightbulb);
export const LightbulbIcon = createIcon(Lightbulb);

// --- NOTIFICATIONS ---
export const NotificationIcon = createIcon(Bell);

// --- LOADERS ---
export const LoadingSpinner: React.FC<IconProps> = ({ size = 24, className = '', color = 'currentColor' }) => (
  <Loader2 size={size} color={color} className={`animate-spin ${className}`} />
);

// --- ALIASES / COMPATIBILITY ---
export const XIcon = CloseIcon; // Common alias
export const SupportIcon = createIcon(MessageCircle);

// --- MISSING ICONS ---
export const AdminIcon = createIcon(Shield);
export const ExportIcon = createIcon(Download);
export const ProfileIcon = createIcon(User);
export const VerificationIcon = createIcon(CheckCircle);
export const SpecializationIcon = createIcon(Briefcase);
export const TimeIcon = createIcon(Clock);
export const ChainIcon = createIcon(Link);
export const PhoneIcon = createIcon(Phone);
export const LockIcon = createIcon(Lock);
export const ExternalLinkIcon = createIcon(ExternalLink);
export const CameraIcon = createIcon(Camera);
export const FileIcon = createIcon(File);
export const ProgressIcon = createIcon(TrendingUp);
export const AchievementIcon = createIcon(Award);
