import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Skill } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';
import { EASE, SectionHeading } from './fx';

const HUES = ['#ff3d5a', '#4cc9ff', '#46e3a8', '#ffb547', '#b98bff', '#ff8a5c', '#7ee0ff'];

export default function Skills() {
  const { data } = usePortfolio();
  const { skillCategories, skillEvidence } = data;

  const [cat, setCat] = useState(0);
  const safeCatIndex = Math.min(cat, Math.max(0, skillCategories.length - 1));
  const category = skillCategories[safeCatIndex] || {
    id: 'skills',
    title: 'Skills',
    subtitle: 'Technical capabilities',
    skills: [],
  };
  const hue = HUES[safeCatIndex % HUES.length];

  return (
    <>
      <SectionHeading kicker="Genres" title="My Skill Universe" aside={<p className="max-w-xs text-sm text-mist">Hover or tap a skill to see where it shows up across projects and certifications.</p>} />

      <div className="gutter grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
        {/* genre list */}
        <div className="rail -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0" role="tablist" aria-label="Skill categories">
          {skillCategories.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={i === safeCatIndex}
              onClick={() => setCat(i)}
              className={`group relative shrink-0 rounded-lg px-4 py-3 text-left transition lg:px-5 cursor-pointer ${i === safeCatIndex ? 'text-bone' : 'text-smoke hover:text-bone'}`}
            >
              {i === safeCatIndex && <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/10" transition={{ duration: 0.45, ease: EASE }} />}
              {i === safeCatIndex && <motion.span layoutId="skill-bar" className="absolute bottom-2 left-0 top-2 hidden w-[3px] rounded lg:block" style={{ background: hue }} />}
              <span className="relative block font-display text-2xl tracking-wide lg:text-3xl">{c.title}</span>
              <span className="relative hidden text-xs text-smoke lg:block">
                {c.skills.length} skills · {c.subtitle}
              </span>
            </button>
          ))}
        </div>

        {/* skill cards */}
        <div className="min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.div key={category.id} initial="hidden" animate="show" exit="exit" transition={{ staggerChildren: 0.05 }}>
              <motion.p
                className="mb-5 text-sm text-mist"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }}
              >
                <span className="font-semibold text-bone">{category.title}</span> — {category.subtitle}
              </motion.p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {category.skills.map((s) => (
                  <SkillCard key={s.name} skill={s} hue={hue} evidence={skillEvidence[s.name]} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function SkillCard({ skill, hue, evidence }: { skill: Skill; hue: string; evidence?: string[] }) {
  const [flipped, setFlipped] = useState(false);
  const hasEvidence = Boolean(evidence && evidence.length > 0);

  return (
    <div
      className="group relative h-[140px] rounded-xl [perspective:800px]"
      onMouseEnter={() => hasEvidence && setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => hasEvidence && setFlipped((v) => !v)}
      role={hasEvidence ? 'button' : undefined}
      tabIndex={hasEvidence ? 0 : undefined}
      aria-label={`${skill.name}${hasEvidence ? ' — tap for evidence' : ''}`}
    >
      <motion.div
        className="relative h-full w-full rounded-xl [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* front */}
        <div className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl bg-ink-2 p-4 ring-1 ring-white/10 [backface-visibility:hidden] transition duration-300 group-hover:ring-white/25">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xl font-bold tracking-tight" style={{ color: hue }}>
              {skill.mono}
            </span>
            {skill.note && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-bone">{skill.note}</span>}
          </div>
          <div>
            <p className="font-sans text-base font-semibold text-bone">{skill.name}</p>
            {hasEvidence ? (
              <p className="mt-0.5 text-[10px] text-smoke group-hover:text-mist">
                {evidence!.length} reference{evidence!.length > 1 ? 's' : ''} →
              </p>
            ) : (
              <span className="h-3" />
            )}
          </div>
        </div>

        {/* back: evidence from the resume */}
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl bg-ink-3 p-3.5 ring-1 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ borderColor: `${hue}55` }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: hue }}>
              APPEARS IN
            </p>
            <ul className="mt-1.5 space-y-1">
              {(evidence || []).slice(0, 3).map((e) => (
                <li key={e} className="truncate text-[11px] text-bone/90">
                  • {e}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[9px] text-smoke">resume facts only</p>
        </div>
      </motion.div>
    </div>
  );
}
