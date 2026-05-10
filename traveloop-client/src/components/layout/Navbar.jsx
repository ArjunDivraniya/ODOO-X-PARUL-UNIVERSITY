import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-6 md:px-12 bg-primary-bg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1280px] mx-auto flex justify-between items-center">
        <Link to="/" className="text-secondary-bg text-2xl font-heading font-bold tracking-tight">
          TripLoop.
        </Link>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline" className="!py-2.5 !px-5 !rounded-[12px] !text-sm hidden sm:inline-flex">Log in</Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" className="!py-2.5 !px-5 !rounded-[12px] !text-sm">Sign up</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
