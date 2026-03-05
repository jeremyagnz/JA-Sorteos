import { ReactNode } from 'react';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="bg-orange-500 rounded-lg p-1.5">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Enduro<span className="text-orange-500">Community</span>
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
