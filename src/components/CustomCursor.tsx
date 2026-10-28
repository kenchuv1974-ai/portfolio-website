import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';

const BADGE_CONFIG: Record<string, { icon: string; label: string; size: number }> = {
  view: { icon: '👁', label: 'VIEW', size: 76 },
  play: { icon: '▶', label: 'PLAY', size: 68 },
  link: { icon: '↗', label: 'OPEN', size: 64 },
  drag: { icon: '↔', label: 'DRAG', size: 68 },
  close: { icon: '✕', label: 'CLOSE', size: 64 },
};

/**
 * Smart High-Visibility Cinematic Reticle Cursor
 * 
 * Solves lag & visibility issues:
 * 1. Zero-latency precision core: Tracks exact pointer coordinates instantaneously for pinpoint clicking.
 * 2. High-contrast dual-tone glow: White core + black contour + vivid crimson halo visible on pure black, white, and images.
 * 3. Fluid cinematic halo: Spring-dampened viewfinder ring with 4 lens orientation ticks.
 * 4. Context-aware modes: Expands over clickables, displays badge on data-cursor, and cleanly yields on text inputs.
 */
export default function CustomCursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const enabled = fine && !reduced;

  // Zero-latency instantaneous coordinates for precision clicking
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth fluid spring coordinates for the trailing atmospheric halo
  const haloX = useSpring(rawX, { stiffness: 450, damping: 32, mass: 0.45 });
  const haloY = useSpring(rawY, { stiffness: 450, damping: 32, mass: 0.45 });

  const [mode, setMode] = useState<string | null>(null);
  const [hoverLink, setHoverLink] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-custom-cursor');

    const handlePointerMove = (e: PointerEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for text editing inputs (yield custom cursor so native text I-beam is clear)
      const inputEl = target.closest('input, textarea, select, [contenteditable="true"]');
      setIsInput(!!inputEl);

      // Check for data-cursor tagged elements
      const tagged = target.closest<HTMLElement>('[data-cursor]');
      setMode(tagged?.dataset.cursor ?? null);

      // Check for interactive buttons or links
      const interactive = !tagged && !!target.closest('a, button, [role="button"], input[type="button"], input[type="submit"]');
      setHoverLink(interactive);
    };

    const handlePointerLeave = () => setVisible(false);
    const handlePointerDown = () => setDown(true);
    const handlePointerUp = () => setDown(false);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const badge = mode ? BADGE_CONFIG[mode] : null;
  const isOverBadge = !!badge;
  const haloSize = isOverBadge ? badge.size : hoverLink ? 48 : 32;

  return (
    <>
      {/* 1. Trailing Atmospheric Cinematic Halo (Spring physics) */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[999] flex items-center justify-center rounded-full will-change-transform"
        style={{
          x: haloX,
          y: haloY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: haloSize,
          height: haloSize,
          opacity: visible && !isInput ? 1 : 0,
          scale: down ? 0.8 : 1,
          rotate: hoverLink ? 45 : 0,
          backgroundColor: isOverBadge
            ? 'rgba(229, 9, 20, 0.94)'
            : hoverLink
              ? 'rgba(229, 9, 20, 0.16)'
              : 'rgba(229, 9, 20, 0.05)',
          borderColor: isOverBadge
            ? 'rgba(255, 255, 255, 0.4)'
            : hoverLink
              ? 'rgba(229, 9, 20, 0.85)'
              : 'rgba(229, 9, 20, 0.55)',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      >
        {/* Outer Viewfinder Ring with High-Visibility Glow */}
        <div
          className="absolute inset-0 rounded-full border border-inherit shadow-[0_0_14px_rgba(229,9,20,0.45)]"
          style={{
            boxShadow: hoverLink
              ? '0 0 18px rgba(229,9,20,0.6), inset 0 0 8px rgba(229,9,20,0.2)'
              : '0 0 10px rgba(229,9,20,0.3)',
          }}
        />

        {/* 4 Smart Lens Reticle Notches (Top, Bottom, Left, Right) */}
        {!isOverBadge && (
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[2px] h-[4px] bg-red-400 rounded-full" />
            <span className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-[2px] h-[4px] bg-red-400 rounded-full" />
            <span className="absolute left-[-3px] top-1/2 -translate-y-1/2 h-[2px] w-[4px] bg-red-400 rounded-full" />
            <span className="absolute right-[-3px] top-1/2 -translate-y-1/2 h-[2px] w-[4px] bg-red-400 rounded-full" />
          </div>
        )}

        {/* Dynamic Context Badge */}
        <AnimatePresence mode="wait">
          {badge && (
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 px-2 text-white font-sans drop-shadow-md select-none"
            >
              <span className="text-[12px] leading-none">{badge.icon}</span>
              <span className="text-[10px] font-bold tracking-[0.16em] leading-none font-mono">
                {badge.label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Zero-Latency Instantaneous Precision Core */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[1000] will-change-transform"
        style={{
          x: rawX,
          y: rawY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible && !isInput ? 1 : 0,
          scale: down ? 0.65 : hoverLink ? 1.4 : 1,
        }}
        transition={{ duration: 0.08 }}
      >
        {/* Core Dot: Crisp White + Black Contour + Crimson Corona */}
        <div className="relative flex items-center justify-center">
          {/* Crimson glow backdrop */}
          <div className="absolute w-4 h-4 rounded-full bg-red-600/60 blur-[2px] animate-pulse" />
          
          {/* Precision Center Marker */}
          <div
            className={`w-2 h-2 rounded-full bg-white transition-all duration-150 ${
              hoverLink ? 'bg-red-400 scale-125' : 'bg-white'
            }`}
            style={{
              boxShadow: '0 0 0 1px #000000, 0 0 6px rgba(229,9,20,0.9), 0 0 12px rgba(255,255,255,0.7)',
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
