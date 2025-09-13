import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
} from "lucide-react";

interface AnalyticsData {
  pageViews: { date: string; views: number; uniqueVisitors: number }[];
  deviceTypes: { device: string; percentage: number; count: number }[];
  topPages: { page: string; views: number; engagement: number }[];
  visitorStats: {
    total: number;
    returning: number;
    new: number;
    avgSessionDuration: string;
    bounceRate: number;
  };
  realTimeStats: {
    activeUsers: number;
    currentPageViews: number;
    topReferrers: string[];
  };
}

const AdvancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: [],
    deviceTypes: [],
    topPages: [],
    visitorStats: {
      total: 0,
      returning: 0,
      new: 0,
      avgSessionDuration: "0:00",
      bounceRate: 0,
    },
    realTimeStats: {
      activeUsers: 0,
      currentPageViews: 0,
      topReferrers: [],
    },
  });

  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = () => {
      setTimeout(() => {
        setAnalyticsData({
          pageViews: [
            { date: "2024-01-01", views: 125, uniqueVisitors: 89 },
            { date: "2024-01-02", views: 168, uniqueVisitors: 112 },
            { date: "2024-01-03", views: 142, uniqueVisitors: 95 },
            { date: "2024-01-04", views: 189, uniqueVisitors: 134 },
            { date: "2024-01-05", views: 156, uniqueVisitors: 108 },
            { date: "2024-01-06", views: 203, uniqueVisitors: 147 },
            { date: "2024-01-07", views: 178, uniqueVisitors: 125 },
          ],
          deviceTypes: [
            { device: "Desktop", percentage: 45, count: 892 },
            { device: "Mobile", percentage: 40, count: 794 },
            { device: "Tablet", percentage: 15, count: 298 },
          ],
          topPages: [
            { page: "/", views: 1205, engagement: 85 },
            { page: "/projects", views: 896, engagement: 78 },
            { page: "/about", views: 567, engagement: 92 },
            { page: "/contact", views: 423, engagement: 88 },
            { page: "/blog", views: 334, engagement: 76 },
          ],
          visitorStats: {
            total: 2847,
            returning: 1698,
            new: 1149,
            avgSessionDuration: "3:24",
            bounceRate: 32.5,
          },
          realTimeStats: {
            activeUsers: 23,
            currentPageViews: 47,
            topReferrers: ["google.com", "github.com", "linkedin.com"],
          },
        });
        setIsLoading(false);
      }, 1000);
    };

    loadAnalytics();
  }, [timeRange]);

  const exportAnalytics = () => {
    const data = {
      timeRange,
      exportDate: new Date().toISOString(),
      ...analyticsData,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio Analytics</h2>
          <p className="text-gray-600">Track your portfolio performance and visitor insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={exportAnalytics}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-600" />
          Real-time Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {analyticsData.realTimeStats.activeUsers}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {analyticsData.realTimeStats.currentPageViews}
            </div>
            <div className="text-sm text-gray-600">Current Page Views</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">Top Referrers</div>
            <div className="text-sm text-gray-600 space-y-1">
              {analyticsData.realTimeStats.topReferrers.map((referrer, index) => (
                <div key={index}>{referrer}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.visitorStats.total.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12.5% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Session</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.visitorStats.avgSessionDuration}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8.2% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.visitorStats.bounceRate}%
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
            <span className="text-sm text-red-600">-2.1% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((analyticsData.visitorStats.new / analyticsData.visitorStats.total) * 100)}%
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+5.7% vs last period</span>
          </div>
        </div>
      </div>

      {/* Device Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            Device Types
          </h3>
          <div className="space-y-4">
            {analyticsData.deviceTypes.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {device.device === "Desktop" && <Monitor className="h-5 w-5 text-gray-600" />}
                  {device.device === "Mobile" && <Smartphone className="h-5 w-5 text-gray-600" />}
                  {device.device === "Tablet" && <Globe className="h-5 w-5 text-gray-600" />}
                  <span className="font-medium">{device.device}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{device.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Top Pages
          </h3>
          <div className="space-y-4">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{page.page}</div>
                  <div className="text-sm text-gray-600">{page.views} views</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{page.engagement}%</div>
                  <div className="text-xs text-gray-600">engagement</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Page Views Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          Page Views Trend
        </h3>
        <div className="h-64 flex items-end gap-2">
          {analyticsData.pageViews.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="relative w-full">
                <div
                  className="bg-blue-500 rounded-t mx-1"
                  style={{
                    height: `${(data.views / 250) * 200}px`,
                    minHeight: "4px",
                  }}
                ></div>
                <div
                  className="bg-purple-400 rounded-t mx-1 mt-1"
                  style={{
                    height: `${(data.uniqueVisitors / 200) * 150}px`,
                    minHeight: "4px",
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                {new Date(data.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" })}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Page Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-400 rounded"></div>
            <span className="text-sm text-gray-600">Unique Visitors</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
