'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import LandingPage from './LandingPage';
import VendorPortal from './VendorPortal';
import InspectorApp from './InspectorApp';
import CommandCenter from './CommandCenter';

export type ActiveView = 'landing' | 'vendor' | 'inspector' | 'command';

export default function KawalApp() {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        currentTime={currentTime}
      />
      <main className="flex-1">
        {activeView === 'landing' && <LandingPage setActiveView={setActiveView} />}
        {activeView === 'vendor' && <VendorPortal />}
        {activeView === 'inspector' && <InspectorApp />}
        {activeView === 'command' && <CommandCenter />}
      </main>
    </div>
  );
}
