declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
    className?: string;
    children?: React.ReactNode;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const Code2: LucideIcon;
  export const Calendar: LucideIcon;
  export const Clock: LucideIcon;
  export const MapPin: LucideIcon;
  export const User: LucideIcon;
  export const Users: LucideIcon;
  export const Trophy: LucideIcon;
  export const Sparkles: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Ticket: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Search: LucideIcon;
  export const Filter: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Plus: LucideIcon;
  export const Trash2: LucideIcon;
  export const Edit3: LucideIcon;
  export const Upload: LucideIcon;
  export const Eye: LucideIcon;
  export const Check: LucideIcon;
  export const X: LucideIcon;
  export const Menu: LucideIcon;
  export const DollarSign: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const TrendingDown: LucideIcon;
  export const Download: LucideIcon;
  export const Printer: LucideIcon;
  export const Receipt: LucideIcon;
  export const Building: LucideIcon;
  export const Building2: LucideIcon;
  export const PieChart: LucideIcon;
  export const CreditCard: LucideIcon;
  export const FileSpreadsheet: LucideIcon;
  export const Settings: LucideIcon;
  export const Lock: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShieldAlert: LucideIcon;
  export const Cpu: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Monitor: LucideIcon;
  export const Heart: LucideIcon;
  export const Github: LucideIcon;
  export const Linkedin: LucideIcon;
  export const Globe: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const LogOut: LucideIcon;
  export const Target: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Award: LucideIcon;
  export const Play: LucideIcon;
  export const PlayCircle: LucideIcon;
  export const Layers: LucideIcon;
  export const Link: LucideIcon;
  export const Image: LucideIcon;
  export const Database: LucideIcon;
  export const Server: LucideIcon;
  export const Tag: LucideIcon;
  export const Sun: LucideIcon;
  export const Moon: LucideIcon;

  const defaultIcon: LucideIcon;
  export default defaultIcon;
}
