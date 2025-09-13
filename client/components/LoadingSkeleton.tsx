import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Loading Navbar */}
      <div className="fixed w-full top-0 z-50 backdrop-blur-md bg-black/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="hidden md:flex items-center space-x-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 w-16 bg-white/10 rounded animate-pulse"
                ></div>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-white/10 rounded-full animate-pulse"></div>
              <div className="h-10 w-28 bg-white/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Hero Section */}
      <section className="min-h-screen relative overflow-hidden pt-32">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="space-y-8">
              {/* Title skeleton */}
              <div className="space-y-4">
                <div className="h-16 w-80 bg-white/10 rounded-lg animate-pulse"></div>
                <div className="h-16 w-96 bg-white/10 rounded-lg animate-pulse"></div>
              </div>

              {/* Subtitle skeleton */}
              <div className="h-8 w-72 bg-white/10 rounded-lg animate-pulse"></div>

              {/* Description skeleton */}
              <div className="space-y-3">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse"></div>
                <div className="h-4 w-4/5 bg-white/10 rounded animate-pulse"></div>
              </div>

              {/* Buttons skeleton */}
              <div className="flex flex-wrap gap-4">
                <div className="h-12 w-36 bg-white/10 rounded-full animate-pulse"></div>
                <div className="h-12 w-28 bg-white/10 rounded-full animate-pulse"></div>
                <div className="h-12 w-28 bg-white/10 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Profile image skeleton */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 lg:w-96 lg:h-96 bg-white/10 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Loading indicator */}
      <div className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white/80 text-sm font-medium">
            Loading amazing content...
          </span>
        </div>
      </div>
    </div>
  );
}
