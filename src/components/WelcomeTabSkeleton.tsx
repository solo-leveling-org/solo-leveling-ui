import React from 'react';

const WelcomeTabSkeleton: React.FC = () => (
  <div className="App">
    {/* TopBar skeleton */}
    <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 p-4">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>
    </div>

    {/* Main content skeleton */}
    <main className="tab-content p-4">
      <div className="max-w-md mx-auto">
        {/* Welcome card skeleton */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl -z-10 transform scale-105"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl -translate-y-8 translate-x-8 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/30 to-orange-400/30 rounded-full blur-xl translate-y-4 -translate-x-4 animate-pulse"></div>

          <div className="relative z-10 text-center">
            {/* Title skeleton */}
            <div className="h-8 bg-gray-300 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            
            {/* Subtitle skeleton */}
            <div className="h-6 bg-gray-300 rounded-lg w-64 mx-auto mb-6 animate-pulse"></div>
            
            {/* Description skeleton */}
            <div className="space-y-3 mb-8">
              <div className="h-4 bg-gray-300 rounded-lg w-full animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded-lg w-5/6 mx-auto animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded-lg w-4/5 mx-auto animate-pulse"></div>
            </div>

            {/* Button skeleton */}
            <div className="h-12 bg-gray-300 rounded-2xl w-40 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="mt-8 flex justify-center space-x-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 w-12 bg-gray-300 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    </main>
  </div>
);

export default WelcomeTabSkeleton;
