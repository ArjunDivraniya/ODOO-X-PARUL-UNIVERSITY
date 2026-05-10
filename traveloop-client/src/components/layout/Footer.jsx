import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#050B11] pt-24 pb-12 px-6 border-t border-white/5 text-neutral-text">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div>
          <div className="text-secondary-bg text-2xl font-heading font-bold tracking-tight mb-6">
            TripLoop.
          </div>
          <p className="opacity-80 leading-relaxed max-w-[250px]">
            Travel Beyond The Tourist Map. Your premium platform for discovering and organizing unforgettable journeys.
          </p>
        </div>
        
        <div>
          <h4 className="text-secondary-bg font-heading font-semibold mb-6">Product</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-accent-blue transition-colors">Itinerary Builder</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Smart Budgeting</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Travel Flow</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Collaborate</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-secondary-bg font-heading font-semibold mb-6">Features</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-accent-blue transition-colors">Packing Checklist</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Travel Journal</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Activity Discovery</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Public Trips</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-secondary-bg font-heading font-semibold mb-6">Socials</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-accent-blue transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">Twitter / X</a></li>
            <li><a href="#" className="hover:text-accent-blue transition-colors">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
        <p>© {new Date().getFullYear()} TripLoop. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-secondary-bg">Privacy Policy</a>
          <a href="#" className="hover:text-secondary-bg">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
