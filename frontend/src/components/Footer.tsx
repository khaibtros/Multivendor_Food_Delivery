import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="container mx-auto max-w-8xl">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          {/* Left side - Logo and App Downloads */}
          <div className="flex-shrink-0 space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">QuickMunch</span>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full bg-black border-gray-600 text-white hover:bg-gray-800 justify-start p-3 h-auto"
                asChild
              >
                <Link to="#" className="flex items-center space-x-3">
                  <div className="bg-white rounded p-1">
                    <svg
                      className="h-6 w-6 text-black"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full bg-black border-gray-600 text-white hover:bg-gray-800 justify-start p-3 h-auto"
                asChild
              >
                <Link to="#" className="flex items-center space-x-3">
                  <div className="bg-white rounded p-1">
                    <svg
                      className="h-6 w-6 text-black"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-400">GET IT ON</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - Navigation Links */}
          <div className="flex flex-wrap justify-between gap-8 lg:gap-12 flex-1 max-w-4xl">
            {/* Partner with Enatega */}
            <div className="space-y-4 min-w-[150px]">
              <h3 className="text-lg font-semibold text-gray-300">
                Partner with us
              </h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  For Restaurants
                </Link>
              </nav>
            </div>

            {/* Products */}
            <div className="space-y-4 min-w-[150px]">
              <h3 className="text-lg font-semibold text-gray-300">Services</h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Order Food
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Restaurant Management
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Delivery Tracking
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Loyalty Program
                </Link>
              </nav>
            </div>

            {/* Company */}
            <div className="space-y-4 min-w-[150px]">
              <h3 className="text-lg font-semibold text-gray-300">Company</h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  About us
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Developers
                </Link>
              </nav>
            </div>

            {/* Follow us */}
            <div className="space-y-4 min-w-[150px]">
              <h3 className="text-lg font-semibold text-gray-300">Follow us</h3>
              <nav className="flex flex-col space-y-3">
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Blog
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Instagram
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Facebook
                </Link>
                <Link
                  to="#"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  LinkedIn
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
