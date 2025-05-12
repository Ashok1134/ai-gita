import React from "react";
import { Heart, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-orange-100 py-4 px-6 shadow-inner">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-orange-800">
              © {new Date().getFullYear()} Bhāgavatam - Spiritual wisdom for
              modern life
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-sm text-orange-800 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              About
            </a>
            <a
              href="#"
              className="text-sm text-orange-800 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-orange-800 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-orange-800 hover:text-orange-600 transition-colors flex items-center gap-1"
            >
              Contact
            </a>
          </div>

          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-xs text-orange-700 flex items-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for
              spiritual seekers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
