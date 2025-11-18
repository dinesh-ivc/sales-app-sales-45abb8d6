'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart3, 
  Globe, 
  Store, 
  Package, 
  User, 
  LogIn, 
  UserPlus,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    requiresAuth: false
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    requiresAuth: true
  },
  {
    name: 'Website Visits',
    href: '/website-visits',
    icon: Globe,
    requiresAuth: true
  },
  {
    name: 'Store Visits',
    href: '/store-visits',
    icon: Store,
    requiresAuth: true
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    requiresAuth: true
  }
];

const authItems = [
  {
    name: 'Login',
    href: '/login',
    icon: LogIn,
    requiresAuth: false
  },
  {
    name: 'Register',
    href: '/register',
    icon: UserPlus,
    requiresAuth: false
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  // Filter navigation based on auth status (in a real app, you'd check actual auth state)
  const isAuthenticated = typeof window !== 'undefined' && localStorage.getItem('token');

  const filteredNavItems = navigationItems.filter(item => 
    item.requiresAuth ? isAuthenticated : true
  );

  const filteredAuthItems = authItems.filter(item => 
    item.requiresAuth ? !isAuthenticated : true
  );

  return (
    <div className="flex flex-col w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Sales App</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isActive ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-gray-200">
        {filteredAuthItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <Button variant="outline" className="w-full justify-start mb-2">
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Button>
            </Link>
          );
        })}

        {isAuthenticated && (
          <Button 
            variant="outline" 
            className="w-full justify-start"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            <User className="w-5 h-5 mr-3" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}