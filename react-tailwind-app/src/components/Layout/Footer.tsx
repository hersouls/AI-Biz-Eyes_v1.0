import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                className="h-6 w-auto opacity-80"
                src="/gnblog_wt_p.png"
                alt="AI Biz Eyes"
              />
              <span className="text-sm font-medium text-gray-700">AI Biz Eyes</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-xs text-gray-500">
              <span>© {currentYear} AI Biz Eyes. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span>v1.0.0</span>
              <span className="hidden md:inline">•</span>
              <span>support@aibizeyes.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;