import {
  LayoutDashboard,
  Heart,
  Sparkles,
  Clock,
  Bell,
  Settings,
  User,
  Package,
  FolderTree,
  Image as ImageIcon,
  Users,
  Star,
  Mail,
  BarChart3,
  FileText,
  type LucideIcon,
} from "lucide-react";

/** String-keyed icon registry so server components can pass icon *names*
 *  (plain strings) to client components without crossing the function
 *  serialization boundary. */
export const navIcons = {
  LayoutDashboard,
  Heart,
  Sparkles,
  Clock,
  Bell,
  Settings,
  User,
  Package,
  FolderTree,
  ImageIcon,
  Users,
  Star,
  Mail,
  BarChart3,
  FileText,
} satisfies Record<string, LucideIcon>;

export type NavIconName = keyof typeof navIcons;

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconName;
}
