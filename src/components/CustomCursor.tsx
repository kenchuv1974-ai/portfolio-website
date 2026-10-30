import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMedia';
import { usePortfolio } from '../context/PortfolioContext';

const BADGE_CONFIG: Record<string, { icon: string; label: string; size: number }> = {
  view: { icon: '👁', label: 'VIEW', size: 76 },
  play: { icon: '▶', label: 'PLAY', size: 68 },
  link: { icon: '↗', label: 'OPEN', size: 64 },
  drag: { icon: '↔', label: 'DRAG', size: 68 },
  close: { icon: '✕', label: 'CLOSE', size: 64 },
};

/**
 * Smart High-Visibility Adaptive Cursor
 * - Dynamically inherits active theme accent color and glow
 * - Supports 3 styles configurable in Admin: 'cinematic' | 'minimal' | 'system'
 * - High-contrast dual-tone glow visible against pure dark and light assets
 * - Automatically yields on inputs, selects, and text areas
 */
export default function CustomCursor() {
  const { data } = usePortfolio();
  const theme = data.themeSettings;
  const cursorStyle = theme?.cursorStyle ?? 'cinematic';

  const fine = useFinePointer();
  const reduced = useReducedMotionPref();
  const enabled = fine && !reduced && cursorStyle !== 'system';

  // Zero-latency instantaneous coordinates for precision clicking
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth fluid spring coordinates for atmospheric trailing halo
  const haloX = useSpring(rawX, { stiffness: 450, damping: 32, mass: 0.45 });
  const haloY = useSpring(rawY, { stiffness: 450, damping: 32, mass: 0.45 });

  const [mode, setMode] = useState<string | null>(null);
  const [hoverLink, setHoverLink] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-custom-cursor');
      return;
    }
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

  const accentColor = theme?.primaryColor || '#e5132b';
  const accentLight = theme?.primaryColorHover || '#ff3d5a';

  // Minimal mode: only renders clean precision dot with smooth micro-halo
  if (cursorStyle === 'minimal') {
    return (
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
          scale: down ? 0.7 : hoverLink ? 1.5 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        <div className="relative flex items-center justify-center">
          <div
            className="w-3 h-3 rounded-full blur-[1px] transition-transform duration-150"
            style={{ backgroundColor: accentColor, opacity: hoverLink ? 0.8 : 0.4 }}
          />
          <div
            className="absolute w-2 h-2 rounded-full bg-white"
            style={{
              boxShadow: `0 0 0 1px rgba(0,0,0,0.8), 0 0 8px ${accentLight}`,
            }}
          />
        </div>
      </motion.div>
    );
  }

  // Cinematic mode: full viewfinder halo + precision core
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
            ? accentColor
            : hoverLink
              ? `${accentColor}25`
              : `${accentColor}0d`,
          borderColor: isOverBadge
            ? 'rgba(255, 255, 255, 0.4)'
            : hoverLink
              ? accentLight
              : `${accentLight}88`,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
      >
        {/* Outer Viewfinder Ring with Dynamic Glow */}
        <div
          className="absolute inset-0 rounded-full border border-inherit"
          style={{
            boxShadow: hoverLink
              ? `0 0 16px ${accentColor}88, inset 0 0 8px ${accentColor}44`
              : `0 0 8px ${accentColor}44`,
          }}
        />

        {/* 4 Smart Lens Reticle Notches (Top, Bottom, Left, Right) */}
        {!isOverBadge && (
          <div className="absolute inset-0 pointer-events-none">
            <span
              className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-[2px] h-[4px] rounded-full"
              style={{ backgroundColor: accentLight }}
            />
            <span
              className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-[2px] h-[4px] rounded-full"
              style={{ backgroundColor: accentLight }}
            />
            <span
              className="absolute left-[-3px] top-1/2 -translate-y-1/2 h-[2px] w-[4px] rounded-full"
              style={{ backgroundColor: accentLight }}
            />
            <span
              className="absolute right-[-3px] top-1/2 -translate-y-1/2 h-[2px] w-[4px] rounded-full"
              style={{ backgroundColor: accentLight }}
            />
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
          scale: down ? 0.65 : hoverLink ? 1.35 : 1,
        }}
        transition={{ duration: 0.08 }}
      >
        <div className="relative flex items-center justify-center">
          {/* Dynamic accent glow backdrop */}
          <div
            className="absolute w-4 h-4 rounded-full blur-[2px] animate-pulse"
            style={{ backgroundColor: `${accentColor}99` }}
          />

          {/* Precision Center Marker */}
          <div
            className="w-2 h-2 rounded-full bg-white transition-all duration-150"
            style={{
              boxShadow: `0 0 0 1px #000000, 0 0 6px ${accentColor}, 0 0 10px rgba(255,255,255,0.7)`,
              backgroundColor: hoverLink ? accentLight : '#ffffff',
            }}
          />
        </div>
      </motion.div>
    </>
  );
}
