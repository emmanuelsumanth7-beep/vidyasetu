'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bus, MapPin, Navigation, Clock, Activity, AlertTriangle, UserCheck, Search, Radio, CheckCircle2, Shield
} from 'lucide-react';
import { Users } from 'lucide-react';
import { readUserSession, ClientUser } from '@/lib/session';

const DynamicTransportMap = dynamic(() => import('@/components/TransportMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#e5e3df] dark:bg-[#242f3e] animate-pulse flex items-center justify-center"><Activity className="animate-spin text-indigo-500" /></div>
});

const BUS_ROUTES = [
  { id: 'RT-01', name: 'Koramangala Express', driver: 'Ramesh K.', status: 'en_route', eta: '5 mins', speed: '42 km/h', students: 42, boarded: 38 },
  { id: 'RT-02', name: 'Indiranagar Shuttle', driver: 'Suresh M.', status: 'delayed', eta: '15 mins', speed: '12 km/h', students: 35, boarded: 12 },
  { id: 'RT-03', name: 'Whitefield Loop',     driver: 'Kumar V.',  status: 'arrived', eta: 'Arrived', speed: '0 km/h', students: 50, boarded: 50 },
];

const BOARDING_EVENTS = [
  { id: 1, time: '07:42 AM', student: 'Aryan Sharma', route: 'RT-01', type: 'boarded', location: 'Stop 4: Sony World Signal' },
  { id: 2, time: '07:45 AM', student: 'Priya Kamath', route: 'RT-01', type: 'boarded', location: 'Stop 5: Oasis Mall' },
  { id: 3, time: '07:50 AM', student: 'Amit V.',      route: 'RT-02', type: 'missed',  location: 'Stop 2: CMH Road' },
];

type ViewRole = 'admin' | 'parent' | 'driver';

export default function TransportDashboard() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [viewRole, setViewRole] = useState<ViewRole>('admin');
  
  // Admin State
  const [selectedRoute, setSelectedRoute] = useState(BUS_ROUTES[0]);
  
  // Parent State
  const [searchBus, setSearchBus] = useState('');
  const [trackedBus, setTrackedBus] = useState<typeof BUS_ROUTES[0] | null>(null);
  
  // Driver State
  const [isTransmitting, setIsTransmitting] = useState(false);

  // Map State (Mock WebSockets)
  const [liveLocation, setLiveLocation] = useState({ lat: 12.935, lng: 77.624 });

  useEffect(() => {
    const session = readUserSession();
    if (session) setUser(session);
    
    // Auto-detect view from session if we wanted to, but for prototype let's default to Admin
    // and provide a toggle so the user can see all 3 personas easily.
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // In production, parent/admin would listen via WebSockets, and driver would emit via Geolocation API.
    if ((viewRole === 'admin') || 
        (viewRole === 'parent' && trackedBus) || 
        (viewRole === 'driver' && isTransmitting)) {
      
      interval = setInterval(() => {
        setLiveLocation(prev => ({
          lat: prev.lat + (Math.random() * 0.0002 - 0.0001),
          lng: prev.lng + (Math.random() * 0.0002 - 0.0001)
        }));
      }, 2000);
    }
    
    return () => clearInterval(interval);
  }, [viewRole, trackedBus, isTransmitting]);

  const handleParentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = BUS_ROUTES.find(r => r.id.toLowerCase() === searchBus.toLowerCase() || r.name.toLowerCase().includes(searchBus.toLowerCase()));
    if (found) {
      setTrackedBus(found);
    } else {
      alert("Bus not found. Try 'RT-01' or 'Koramangala'");
      setTrackedBus(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto w-full animate-fade-in pb-20 space-y-6">
      
      {/* ── DEMO PERSONA TOGGLE (Prototype Only) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 glass-card rounded-2xl border border-indigo-500/30 bg-indigo-500/5 mb-8">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-indigo-500" />
          <span className="text-sm font-bold text-indigo-500">Prototype Persona Switcher</span>
        </div>
        <div className="flex gap-2">
          {(['admin', 'parent', 'driver'] as const).map(role => (
            <button key={role} onClick={() => setViewRole(role)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${viewRole === role ? 'bg-indigo-600 text-white shadow-lg' : 'bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10'}`}>
              {role} View
            </button>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3" style={{ color: 'var(--color-text-primary)' }}>
            <Bus className="text-indigo-500" size={32} />
            {viewRole === 'admin' && 'Live Transport Fleet'}
            {viewRole === 'parent' && 'Track Your Child'}
            {viewRole === 'driver' && 'Driver Console'}
          </h1>
          <p className="text-sm mt-1 font-bold" style={{ color: 'var(--color-text-secondary)' }}>
            {viewRole === 'admin' && 'Real-time GPS tracking and boarding notifications.'}
            {viewRole === 'parent' && 'Enter your assigned bus number to see live location.'}
            {viewRole === 'driver' && 'Start sharing your location with the school and parents.'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ── DRIVER VIEW ── */}
        {viewRole === 'driver' && (
          <motion.div key="driver" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="glass-card p-8 text-center max-w-2xl mx-auto border-2 border-indigo-500/20">
              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                <Radio size={40} className={`${isTransmitting ? 'text-green-500 animate-pulse' : 'text-indigo-500'}`} />
              </div>
              <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--color-text-primary)' }}>
                {isTransmitting ? 'Transmitting Live Location' : 'Ready for Journey?'}
              </h2>
              <p className="text-sm font-medium mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                {isTransmitting ? 'Your GPS data is securely streaming to parents and the school.' : 'Tap below to start broadcasting your live GPS location to the transport grid.'}
              </p>
              
              <button onClick={() => setIsTransmitting(!isTransmitting)}
                className={`px-8 py-4 rounded-2xl font-black text-lg text-white shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto ${isTransmitting ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {isTransmitting ? (
                  <><AlertTriangle size={24} /> End Journey</>
                ) : (
                  <><Navigation size={24} /> Start Journey</>
                )}
              </button>
            </div>

            {isTransmitting && (
              <div className="glass-card overflow-hidden relative shadow-2xl rounded-2xl mx-auto max-w-4xl" style={{ height: '400px', border: '1px solid var(--color-border)' }}>
                <DynamicTransportMap busLocation={liveLocation} routeName="Your Bus (Broadcasting)" />
                <div className="absolute top-4 left-4 glass-card p-3 shadow-2xl border z-10" style={{ background: 'var(--surface)', borderColor: 'var(--color-border)' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Broadcasting GPS
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── PARENT VIEW ── */}
        {viewRole === 'parent' && (
          <motion.div key="parent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <div className="glass-card p-6 max-w-xl">
              <form onSubmit={handleParentSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" />
                  <input type="text" placeholder="Enter Bus Number (e.g. RT-01)"
                    value={searchBus} onChange={e => setSearchBus(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 text-sm font-bold focus:outline-none transition-all text-black dark:text-white"
                  />
                </div>
                <button type="submit" className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm shadow-lg transition-colors">
                  Track
                </button>
              </form>
            </div>

            {trackedBus && (
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-6">
                <div className="xl:col-span-1 space-y-4">
                  <div className="glass-card p-6 rounded-2xl border-l-4 border-indigo-500">
                    <h3 className="text-xl font-black mb-1 text-black dark:text-white">{trackedBus.name}</h3>
                    <p className="text-sm font-bold text-indigo-500 mb-6">Bus ID: {trackedBus.id}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"><Clock size={14} className="text-indigo-500" /></div>
                        <div><p className="text-xs font-bold text-black/40 dark:text-white/40">ETA</p><p className="font-black text-black dark:text-white">{trackedBus.eta}</p></div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"><Navigation size={14} className="text-indigo-500" /></div>
                        <div><p className="text-xs font-bold text-black/40 dark:text-white/40">Speed</p><p className="font-black text-black dark:text-white">{trackedBus.speed}</p></div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center"><Users size={14} className="text-indigo-500" /></div>
                        <div><p className="text-xs font-bold text-black/40 dark:text-white/40">Driver</p><p className="font-black text-black dark:text-white">{trackedBus.driver}</p></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-3">
                  <div className="glass-card overflow-hidden relative shadow-2xl rounded-2xl" style={{ height: '400px', border: '1px solid var(--color-border)' }}>
                    <DynamicTransportMap busLocation={liveLocation} routeName={trackedBus.name} />
                    <div className="absolute top-4 left-4 glass-card p-3 shadow-2xl border z-10" style={{ background: 'var(--surface)', borderColor: 'var(--color-border)' }}>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Parent Sync
                      </p>
                      <h4 className="font-black text-sm" style={{ color: 'var(--color-text-primary)' }}>{trackedBus.name}</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ── ADMIN VIEW ── */}
        {viewRole === 'admin' && (
          <motion.div key="admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-4">
              <h3 className="text-lg font-black" style={{ color: 'var(--color-text-primary)' }}>Active Routes</h3>
              
              <div className="space-y-3">
                {BUS_ROUTES.map(route => {
                  const active = selectedRoute.id === route.id;
                  return (
                    <div key={route.id} onClick={() => setSelectedRoute(route)}
                         className="glass-card p-5 cursor-pointer transition-all border-l-4"
                         style={{ 
                           borderLeftColor: route.status === 'delayed' ? '#FF9500' : route.status === 'arrived' ? '#34C759' : '#1B2A4A',
                           background: active ? 'var(--surface)' : 'var(--color-glass)',
                         }}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-sm" style={{ color: 'var(--color-text-primary)' }}>{route.name}</h4>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md" 
                              style={{ background: route.status === 'delayed' ? 'rgba(255,149,0,0.1)' : 'rgba(27,42,74,0.1)', 
                                       color: route.status === 'delayed' ? '#FF9500' : '#1B2A4A' }}>
                          {route.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                        <span className="flex items-center gap-1"><Clock size={14} /> ETA: {route.eta}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {route.boarded}/{route.students}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="glass-card p-5 mt-6 border border-red-500/30" style={{ background: 'rgba(255,59,48,0.02)' }}>
                <h4 className="text-sm font-black text-red-500 flex items-center gap-2 mb-2"><AlertTriangle size={16} /> Fleet Alert</h4>
                <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Route RT-02 is experiencing heavy traffic near Indiranagar. ETA pushed by 10 mins. Automated SMS dispatched to parents.</p>
              </div>
            </div>

            <div className="xl:col-span-2 space-y-6">
              <div className="glass-card overflow-hidden relative shadow-2xl" style={{ height: '350px', border: '1px solid var(--color-border)' }}>
                <DynamicTransportMap busLocation={liveLocation} routeName={selectedRoute.name} />
                <div className="absolute top-4 left-4 glass-card p-3 shadow-2xl border z-10" style={{ background: 'var(--surface)', borderColor: 'var(--color-border)' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> WebSocket Sync
                  </p>
                  <h4 className="font-black text-sm" style={{ color: 'var(--color-text-primary)' }}>{selectedRoute.name}</h4>
                  <p className="text-xs font-bold flex items-center gap-1 mt-1" style={{ color: 'var(--color-text-secondary)' }}><Navigation size={12} /> {selectedRoute.speed}</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <Activity size={20} className="text-indigo-500" />
                    Live Event Stream
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-tertiary)' }}>RFID Scanner Active</p>
                </div>
                
                <div className="space-y-4">
                  {BOARDING_EVENTS.map(ev => (
                    <div key={ev.id} className="flex items-center justify-between p-4 rounded-2xl border" style={{ background: 'var(--surface)', borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                             style={{ background: ev.type === 'boarded' ? 'rgba(52,199,89,0.1)' : 'rgba(255,59,48,0.1)', color: ev.type === 'boarded' ? '#34C759' : '#FF3B30' }}>
                          <UserCheck size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-black" style={{ color: 'var(--color-text-primary)' }}>{ev.student}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{ev.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold" style={{ color: ev.type === 'boarded' ? '#34C759' : '#FF3B30' }}>
                          {ev.type === 'boarded' ? 'BOARDED' : 'MISSED BUS'}
                        </p>
                        <p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
