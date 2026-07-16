import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, X } from 'lucide-react';

interface MobileNavProps {
  navItems: { name: string; href: string; icon: any }[];
}

export function MobileNav({ navItems }: MobileNavProps) {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Close sheet on route change
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isMoreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMoreOpen]);

  const primaryItems = navItems.slice(0, 4);
  const moreItems = navItems.slice(4);
  const hasMore = moreItems.length > 0;

  return (
    <>
      {/* PhonePe Style Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white pb-safe z-40 flex items-center justify-around px-2 py-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
        {primaryItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <button className={`flex flex-col items-center justify-center w-full gap-1 py-1 transition-colors ${isActive ? 'text-interactive-blue' : 'text-[#666666] hover:text-ink-primary'}`}>
                <div className={`relative flex items-center justify-center w-12 h-8 ${isActive ? 'bg-interactive-blue/10 rounded-full' : ''}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-interactive-blue' : 'text-[#666666]'} />
                </div>
                <span className={`text-[11px] font-body truncate px-1 max-w-full ${isActive ? 'font-bold text-interactive-blue' : 'font-medium'}`}>{item.name}</span>
              </button>
            </Link>
          );
        })}
        
        {hasMore && (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMoreOpen(true);
            }}
            className={`flex-1 flex flex-col items-center justify-center w-full gap-1 py-1 transition-colors ${isMoreOpen ? 'text-interactive-blue' : 'text-[#666666] hover:text-ink-primary'}`}
          >
            <div className={`relative flex items-center justify-center w-12 h-8 ${isMoreOpen ? 'bg-interactive-blue/10 rounded-full' : ''}`}>
              <MoreHorizontal size={24} strokeWidth={isMoreOpen ? 2.5 : 1.5} className={isMoreOpen ? 'text-interactive-blue' : 'text-[#666666]'} />
            </div>
            <span className={`text-[11px] font-body truncate px-1 max-w-full ${isMoreOpen ? 'font-bold text-interactive-blue' : 'font-medium'}`}>More</span>
          </button>
        )}
      </div>

      {/* More Items Bottom Sheet (Updated to be softer to match this new vibe) */}
      <AnimatePresence>
        {isMoreOpen && hasMore && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="md:hidden fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
              aria-hidden="true"
            />
            
            {/* Sheet */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="md:hidden fixed bottom-0 left-0 right-0 bg-white z-50 flex flex-col max-h-[85vh] rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
              role="dialog"
              aria-modal="true"
              aria-label="More navigation options"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
                <h3 className="font-bold text-lg font-body text-ink-primary">All Modules</h3>
                <button 
                  onClick={() => setIsMoreOpen(false)}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-4 flex flex-col gap-2 pb-8 bg-gray-50">
                {moreItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <button className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${isActive ? 'bg-white shadow-sm border border-interactive-blue/20 font-bold text-interactive-blue' : 'bg-white border border-gray-100 hover:border-gray-200 font-medium text-ink-primary'}`}>
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-interactive-blue/10' : 'bg-gray-50'}`}>
                          <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-interactive-blue' : 'text-gray-500'} />
                        </div>
                        {item.name}
                      </button>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
