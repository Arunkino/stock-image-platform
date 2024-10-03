import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-2 md:mb-0">
            © {currentYear} Stock Image Platform App. All rights reserved.
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 text-sm mr-2">Developed by Arun KS</span>
            <a href="https://github.com/arunkino" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 mr-2">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/arunkino" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
