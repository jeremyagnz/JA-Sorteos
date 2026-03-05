'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Settings, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type UserWithRole = NetlifyIdentityUser & { role?: string };

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
  const [identityReady, setIdentityReady] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const checkIdentity = () => {
      if (window.netlifyIdentity) {
        setIdentityReady(true);
        const u = window.netlifyIdentity.currentUser();
        if (u) {
          fetchUserRole(u);
        }

        const handleLogin = (user?: NetlifyIdentityUser) => {
          if (user) fetchUserRole(user);
          window.netlifyIdentity?.close();
        };
        const handleLogout = () => setCurrentUser(null);

        window.netlifyIdentity.on('login', handleLogin);
        window.netlifyIdentity.on('logout', handleLogout);

        cleanup = () => {
          window.netlifyIdentity?.off('login', handleLogin);
          window.netlifyIdentity?.off('logout', handleLogout);
        };
      }
    };

    // The widget is initialised asynchronously by NetlifyIdentityProvider.
    // Listen for both "load" and the custom "netlify-identity-ready" event so
    // we pick it up regardless of which fires first relative to this effect.
    if (document.readyState === 'complete') {
      checkIdentity();
    } else {
      window.addEventListener('load', checkIdentity);
    }
    window.addEventListener('netlify-identity-ready', checkIdentity);

    return () => {
      window.removeEventListener('load', checkIdentity);
      window.removeEventListener('netlify-identity-ready', checkIdentity);
      cleanup?.();
    };
  }, []);

  const fetchUserRole = async (user: NetlifyIdentityUser) => {
    try {
      const token = user.token?.access_token;
      if (!token) {
        setCurrentUser({ ...user });
        return;
      }
      const res = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json() as { user: { role?: string } };
        setCurrentUser({ ...user, role: data.user.role });
      } else {
        setCurrentUser({ ...user });
      }
    } catch {
      setCurrentUser({ ...user });
    }
  };

  const handleLogin = () => {
    window.netlifyIdentity?.open('login');
  };

  const handleSignup = () => {
    window.netlifyIdentity?.open('signup');
  };

  const handleLogout = () => {
    window.netlifyIdentity?.logout();
  };

  const displayName =
    currentUser?.user_metadata?.full_name ?? currentUser?.email ?? '';

  const navLinks = [{ href: '/', label: 'Eventos', icon: Calendar }];

  return (
    <header className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500 rounded-lg p-1.5 group-hover:bg-orange-400 transition-colors">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Enduro<span className="text-orange-500">Community</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium"
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="bg-orange-500 rounded-full p-1.5">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{displayName}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                    {currentUser.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Panel Admin
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : identityReady ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  Iniciar sesión
                </Button>
                <Button variant="primary" size="sm" onClick={handleSignup}>
                  Registrarse
                </Button>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 text-gray-300 hover:text-white py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            {currentUser?.role === 'admin' && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-orange-400 hover:text-orange-300 py-2 text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            )}
            <hr className="border-gray-700" />
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 py-2 text-sm font-medium w-full"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogin}
                  className="flex-1 text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  Iniciar sesión
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSignup}
                  className="flex-1"
                >
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
