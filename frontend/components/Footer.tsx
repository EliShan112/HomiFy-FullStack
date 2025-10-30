"use client";
import { HomeIcon, BriefcaseIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { GlobeAltIcon, HeartIcon } from "@heroicons/react/24/solid";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 mt-10">
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Column 1 */}
        <div>
          <h3 className="font-bold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5" />
              <span>Homes</span>
            </li>
            <li className="flex items-center space-x-2">
              <BriefcaseIcon className="h-5 w-5" />
              <span>Experiences</span>
            </li>
            <li className="flex items-center space-x-2">
              <Cog6ToothIcon className="h-5 w-5" />
              <span>Services</span>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="font-bold mb-4">Support</h3>
          <ul className="space-y-2">
            <li>Help Center</li>
            <li>Safety Information</li>
            <li>Cancellation Options</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="font-bold mb-4">Hosting</h3>
          <ul className="space-y-2">
            <li>Become a Host</li>
            <li>Host Resources</li>
            <li>Community Forum</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="font-bold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>About</li>
            <li>Careers</li>
            <li>Newsroom</li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-300 py-6 flex flex-col sm:flex-row items-center justify-between px-8">
        <p className="text-sm">© 2025 Airbnb Clone · Privacy · Terms · Sitemap</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <GlobeAltIcon className="h-5 w-5" />
          <HeartIcon className="h-5 w-5 text-red-500" />
        </div>
      </div>
    </footer>
  );
}
