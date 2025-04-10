"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaLoaded, setVantaLoaded] = useState(false);

  useEffect(() => {
    // Only load Vanta in the browser, not during SSR
    if (typeof window !== 'undefined' && !vantaEffect) {
      const loadVanta = async () => {
        try {
          // Dynamically import Three.js and Vanta
          const THREE = await import('three');
          const VANTA = await import('vanta/dist/vanta.net.min');
          
          if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
              VANTA.default({
                el: vantaRef.current,
                THREE: THREE,
                mouseControls: false,
                touchControls: false,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x0066ff,
                backgroundColor: 0xC0C0C0,
                points: 12.00,
                maxDistance: 21.00,
                spacing: 18.00,
                opacity: 0.5
              })
            );
            setVantaLoaded(true);
          }
        } catch (error) {
          console.error("Failed to load Vanta.js:", error);
        }
      };

      loadVanta();
    }

    // Cleanup function
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div className="relative min-h-screen">
      <div 
        ref={vantaRef} 
        className="fixed inset-0 pointer-events-none"
        style={{ 
          zIndex: -1, 
          backgroundColor: '#C0C0C0',
          opacity: 0.5
        }}
      />
      <div className={`relative transition-opacity duration-500 ${vantaLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </div>
  );
} 