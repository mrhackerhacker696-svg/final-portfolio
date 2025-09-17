import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  Eye,
  Users,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  MapPin,
  Calendar,
  Download,
  Mail,
  MessageSquare,
  Activity,
  Zap,
  Target,
  Star,
} from "lucide-react";

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  averageTimeOnSite: number;
  bounceRate: number;
  contactFormSubmissions: number;
  downloadCount: number;
}

interface DeviceData {
  name: string;
  value: number;
  color: string;
}

interface TrafficData {
  time: string;
  visitors: number;
  pageViews: number;
}

interface PopularSection {
  section: string;
  views: number;
  engagement: number;
}

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    averageTimeOnSite: 0,
    bounceRate: 0,
    contactFormSubmissions: 0,
    downloadCount: 0,
  });

  const [isRealTime, setIsRealTime] = useState(true);
  const [timeRange, setTimeRange] = useState("24h");

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRealTime) {
        setAnalytics((prev) => ({
          pageViews: prev.pageViews + Math.floor(Math.random() * 5) + 1,
          uniqueVisitors: prev.uniqueVisitors + Math.floor(Math.random() * 3),
          averageTimeOnSite: Math.floor(Math.random() * 300) + 120,
          bounceRate: Math.floor(Math.random() * 30) + 25,
          contactFormSubmissions:
            prev.contactFormSubmissions + (Math.random() > 0.8 ? 1 : 0),
          downloadCount: prev.downloadCount + (Math.random() > 0.9 ? 1 : 0),
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTime]);

  // Initialize with some base data
  useEffect(() => {
    setAnalytics({
      pageViews: Math.floor(Math.random() * 1000) + 500,
      uniqueVisitors: Math.floor(Math.random() * 200) + 100,
      averageTimeOnSite: Math.floor(Math.random() * 200) + 150,
      bounceRate: Math.floor(Math.random() * 20) + 30,
      contactFormSubmissions: Math.floor(Math.random() * 15) + 5,
      downloadCount: Math.floor(Math.random() * 10) + 2,
    });
  }, []);

  const deviceData: DeviceData[] = [
    { name: "Desktop", value: 65, color: "#3b82f6" },
    { name: "Mobile", value: 30, color: "#10b981" },
    { name: "Tablet", value: 5, color: "#f59e0b" },
  ];

  const trafficData: TrafficData[] = [
    { time: "00:00", visitors: 45, pageViews: 120 },
    { time: "04:00", visitors: 28, pageViews: 75 },
    { time: "08:00", visitors: 89, pageViews: 240 },
    { time: "12:00", visitors: 156, pageViews: 420 },
    { time: "16:00", visitors: 134, pageViews: 380 },
    { time: "20:00", visitors: 98, pageViews: 280 },
  ];

  const popularSections: PopularSection[] = [
    { section: "Hero Section", views: 1245, engagement: 85 },
    { section: "Projects", views: 987, engagement: 92 },
    { section: "Skills", views: 756, engagement: 78 },
    { section: "Contact", views: 543, engagement: 96 },
    { section: "About", views: 432, engagement: 82 },
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Portfolio Analytics
              </h1>
              <p className="text-gray-400">
                Real-time insights into your portfolio performance
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 lg:mt-0">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${isRealTime ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
                />
                <span className="text-sm text-gray-400">
                  {isRealTime ? "Live" : "Paused"}
                </span>
              </div>

              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isRealTime
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-600 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {isRealTime ? "Pause" : "Resume"}
              </button>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +12%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.pageViews.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Page Views</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +8%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.uniqueVisitors.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Unique Visitors</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-green-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +5%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatTime(analytics.averageTimeOnSite)}
            </div>
            <div className="text-gray-400 text-sm">Avg. Session</div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-400" />
              </div>
              <div className="text-red-400 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="h-4 w-4 rotate-180" />
                -3%
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {analytics.bounceRate}%
            </div>
            <div className="text-gray-400 text-sm">Bounce Rate</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Traffic Chart */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-400" />
              Traffic Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="url(#colorVisitors)"
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stackId="1"
                  stroke="#10B981"
                  fill="url(#colorPageViews)"
                />
                <defs>
                  <linearGradient
                    id="colorVisitors"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="colorPageViews"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Monitor className="h-5 w-5 text-green-400" />
              Device Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {deviceData.map((device) => (
                <div
                  key={device.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-gray-300 text-sm">{device.name}</span>
                  </div>
                  <span className="text-white font-medium">
                    {device.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Sections & Actions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popular Sections */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Popular Sections
            </h3>
            <div className="space-y-4">
              {popularSections.map((section, index) => (
                <div
                  key={section.section}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {section.section}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {section.views} views
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${
                        section.engagement >= 90
                          ? "text-green-400"
                          : section.engagement >= 80
                            ? "text-yellow-400"
                            : "text-orange-400"
                      }`}
                    >
                      {section.engagement}%
                    </div>
                    <div className="text-gray-400 text-xs">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg p-4 text-center hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer">
                <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-medium text-sm">
                  Contact Forms
                </div>
                <div className="text-blue-400 text-lg font-bold">
                  {analytics.contactFormSubmissions}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 text-center hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 cursor-pointer">
                <Download className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium text-sm">
                  CV Downloads
                </div>
                <div className="text-green-400 text-lg font-bold">
                  {analytics.downloadCount}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 text-center hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer">
                <Globe className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-medium text-sm">
                  Page Visits
                </div>
                <div className="text-purple-400 text-lg font-bold">
                  {analytics.pageViews}
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg p-4 text-center hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 cursor-pointer">
                <Clock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-white font-medium text-sm">Avg. Time</div>
                <div className="text-orange-400 text-lg font-bold">
                  {formatTime(analytics.averageTimeOnSite)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
