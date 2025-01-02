"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-500">Mind Notion</div>

          {/* Menu button (for mobile screens) */}
          <button
            className="text-gray-700 md:hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>

          {/* Links */}
          <div
            className={cn(
              "md:flex space-x-6 w-full md:w-auto",
              isOpen ? "block" : "hidden"
            )}
          >
            <a
              href="#"
              className="block md:inline-block text-gray-700 hover:text-blue-500 py-2 px-4"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
