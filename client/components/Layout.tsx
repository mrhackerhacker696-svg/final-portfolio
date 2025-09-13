import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SMSNotifications from "./SMSNotifications";
import {
  LayoutDashboard,
  Target,
  FolderOpen,
  Activity,
  Github,
  Settings,
  User,
  Search,
  Bell,
  LogOut,
  MessageCircle,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Skills", href: "/skills", icon: Target },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Activities", href: "/activities", icon: Activity },
    { name: "Messages", href: "/contact", icon: MessageCircle },
    { name: "SMS Alerts", href: "/sms-management", icon: Bell },
    { name: "Git Integration", href: "/git-integration", icon: Github },
    { name: "Admin Settings", href: "/admin-settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950">
      {/* Subtle grid + glow background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            `linear-gradient(rgba(59,130,246,0.08) 1px, transparent 1px),
             linear-gradient(90deg, rgba(59,130,246,0.08) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute -inset-32 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_50%)]" />
      {/* Sidebar */}
      <div className="w-64 bg-white/10 backdrop-blur-md border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow">⚡ logo</div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActive(item.href)
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-200 border-r-2 border-cyan-400"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Icon className="mr-3 h-5 w-5 opacity-90" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center text-xs text-slate-400">
          Made with ⚡ Visily
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Navigation tabs */}
            <nav className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${isActive(item.href)
                      ? "text-cyan-300 border-b-2 border-cyan-400 pb-1"
                      : "text-slate-300 hover:text-white"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              {/* SMS Notifications */}
              <SMSNotifications />

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-emerald-400/20 border border-emerald-300/20 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-200">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
