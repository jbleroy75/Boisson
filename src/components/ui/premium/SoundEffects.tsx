'use client';

import { useRef, useCallback, createContext, useContext, useState, useEffect } from 'react';

// Audio context for web audio API
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound types
type SoundType = 'click' | 'hover' | 'success' | 'error' | 'pop' | 'whoosh' | 'bubble' | 'notification';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  ramp?: 'up' | 'down' | 'updown';
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: {
    frequency: 800,
    duration: 0.05,
    type: 'sine',
    volume: 0.1,
    ramp: 'down',
  },
  hover: {
    frequency: 600,
    duration: 0.03,
    type: 'sine',
    volume: 0.05,
    ramp: 'up',
  },
  success: {
    frequency: 880,
    duration: 0.15,
    type: 'sine',
    volume: 0.15,
    ramp: 'updown',
  },
  error: {
    frequency: 200,
    duration: 0.2,
    type: 'sawtooth',
    volume: 0.1,
    ramp: 'down',
  },
  pop: {
    frequency: 1200,
    duration: 0.04,
    type: 'sine',
    volume: 0.12,
    ramp: 'down',
  },
  whoosh: {
    frequency: 400,
    duration: 0.15,
    type: 'sine',
    volume: 0.08,
    ramp: 'updown',
  },
  bubble: {
    frequency: 500,
    duration: 0.08,
    type: 'sine',
    volume: 0.1,
    ramp: 'up',
  },
  notification: {
    frequency: 1000,
    duration: 0.12,
    type: 'sine',
    volume: 0.15,
    ramp: 'updown',
  },
};

// Hook to play sounds
export function useSound() {
  const play = useCallback((type: SoundType) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (required for autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const config = soundConfigs[type];
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

    // Apply frequency modulation for certain sounds
    if (type === 'success') {
      oscillator.frequency.setValueAtTime(660, ctx.currentTime);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.05);
      oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    } else if (type === 'whoosh') {
      oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + config.duration);
    } else if (type === 'bubble') {
      oscillator.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + config.duration);
    }

    // Volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);

    switch (config.ramp) {
      case 'up':
        gainNode.gain.linearRampToValueAtTime(config.volume, ctx.currentTime + config.duration);
        break;
      case 'down':
        gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + config.duration);
        break;
      case 'updown':
        gainNode.gain.linearRampToValueAtTime(config.volume, ctx.currentTime + config.duration / 2);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + config.duration);
        break;
    }

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);
  }, []);

  return { play };
}

// Sound Context for global sound settings
interface SoundContextType {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  play: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(1);
  const { play: playSound } = useSound();

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('tamarque-sound-enabled');
    if (saved !== null) {
      setEnabled(saved === 'true');
    }
  }, []);

  // Save preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('tamarque-sound-enabled', String(enabled));
  }, [enabled]);

  const play = useCallback(
    (type: SoundType) => {
      if (enabled) {
        playSound(type);
      }
    },
    [enabled, playSound]
  );

  return (
    <SoundContext.Provider value={{ enabled, setEnabled, volume, setVolume, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return context;
}

// Sound toggle button
export function SoundToggle({ className = '' }: { className?: string }) {
  const { enabled, setEnabled } = useSoundContext();

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`p-2 rounded-full transition-colors ${
        enabled ? 'bg-[#FF6B35] text-white' : 'bg-gray-200 text-gray-600'
      } ${className}`}
      aria-label={enabled ? 'Désactiver le son' : 'Activer le son'}
    >
      {enabled ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      )}
    </button>
  );
}

// Button with sound
export function SoundButton({
  children,
  onClick,
  className = '',
  soundOnClick = 'click',
  soundOnHover = 'hover',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  soundOnClick?: SoundType;
  soundOnHover?: SoundType | null;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { play } = useSoundContext();

  return (
    <button
      className={className}
      onClick={() => {
        play(soundOnClick);
        onClick?.();
      }}
      onMouseEnter={() => soundOnHover && play(soundOnHover)}
      {...props}
    >
      {children}
    </button>
  );
}

// Link with sound
export function SoundLink({
  children,
  href,
  className = '',
  soundOnClick = 'click',
  soundOnHover = 'hover',
  ...props
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  soundOnClick?: SoundType;
  soundOnHover?: SoundType | null;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { play } = useSoundContext();

  return (
    <a
      href={href}
      className={className}
      onClick={() => play(soundOnClick)}
      onMouseEnter={() => soundOnHover && play(soundOnHover)}
      {...props}
    >
      {children}
    </a>
  );
}

// Cart add sound effect
export function useCartSound() {
  const { play } = useSoundContext();

  return {
    playAddToCart: () => play('pop'),
    playRemoveFromCart: () => play('whoosh'),
    playCheckoutSuccess: () => play('success'),
    playError: () => play('error'),
  };
}

// Notification sound
export function useNotificationSound() {
  const { play } = useSoundContext();

  return {
    playNotification: () => play('notification'),
    playSuccess: () => play('success'),
    playError: () => play('error'),
  };
}
