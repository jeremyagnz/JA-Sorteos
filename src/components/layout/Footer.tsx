import Link from 'next/link';
import { Trophy, Github, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-orange-500 rounded-lg p-1.5">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">
                Enduro<span className="text-orange-500">Community</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Tu comunidad de deportes de motor todo terreno. Enduro, motocross, trial y mucho más.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Eventos
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Síguenos</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} EnduroCommunity. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
