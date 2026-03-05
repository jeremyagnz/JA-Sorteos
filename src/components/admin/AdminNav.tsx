'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ClipboardList,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/events', label: 'Eventos', icon: Calendar },
  { href: '/admin/registrations', label: 'Inscripciones', icon: ClipboardList },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-900 px-4 py-3">
        <p className="text-white font-semibold text-sm">Panel Administrativo</p>
      </div>
      <ul className="py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                {isActive && <ChevronRight className="h-4 w-4 text-orange-500" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
