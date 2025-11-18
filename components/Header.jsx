'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, BarChart3, MapPin, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Website Visits', href: '/website-visits', icon: BarChart3 },
    { name: 'Store Visits', href: '/store-visits', icon: MapPin },
    { name: 'Products', href: '/products', icon: Package },
  ];

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-xl font-bold text-blue-600">
            Sales<span className="font-normal">App</span>
          </Link>

          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link href={item.href} key={item.name}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    className={`flex items-center gap-2 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}