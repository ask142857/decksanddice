'use client'

/*
  THEMATIC ANALYSIS
  - Domain: board game cafe (hospitality + community + play)
  - Emotional tone: warm + energetic (neighborhood pub meets game night)
  - Visual metaphor: candlelit wooden table covered in game pieces, dice, cards, meeples
  - Typography personality: editorial-warm headlines (Fraunces) + humanist body (Nunito)
*/

import { Fraunces, Nunito } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Menu,
  X,
  Dice5,
  BookOpen,
  Trophy,
  Search,
  Sparkles,
  Users,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
} from 'lucide-react'
import styles from './landing.module.css'

const headingFont = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '600', '700', '800', '900'],
})
const bodyFont = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700', '800'],
})

const APP_NAME = 'DecksAndDice'

export default function LandingClient() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeFrame, setActiveFrame] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const fadeUp = prefersReducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
      }

  const frames = [
    {
      title: 'Browse the Shelf',
      caption: 'Every game in the cafe, with cover art, player counts, and playtime.',
      type: 'catalog' as const,
    },
    {
      title: 'Learn Before You Sit',
      caption: 'Step-by-step rules, stats, and tips — read in the cab on the way over.',
      type: 'rules' as const,
    },
    {
      title: 'Climb the Leaderboard',
      caption: 'Log your wins and rise to the top of the house rankings.',
      type: 'leaderboard' as const,
    },
  ]

  return (
    <div className={`${headingFont.variable} ${bodyFont.variable} ${styles.landingRoot}`}>
      <div className={styles.landingBody}>
        {/* NAV */}
        <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
          <div className={styles.navInner}>
            <Link href="/" className={styles.brand}>
              <span className={styles.brandIcon} aria-hidden>
                <Dice5 size={20} strokeWidth={2.4} />
              </span>
              <span className={styles.brandName}>{APP_NAME}</span>
            </Link>

            <div className={styles.navLinks}>
              <Link href="#games" className={styles.navLink}>
                The Shelf
              </Link>
              <Link href="#leaderboard" className={styles.navLink}>
                Leaderboard
              </Link>
              <Link href="/sign-in" className={styles.navGhost}>
                Sign in
              </Link>
              <Link href="/sign-up" className={styles.navPrimary}>
                Get started
              </Link>
            </div>

            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {menuOpen && (
            <div className={styles.mobileMenu}>
              <Link href="#games" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                The Shelf
              </Link>
              <Link href="#leaderboard" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Leaderboard
              </Link>
              <Link href="/sign-in" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
              <Link href="/sign-up" className={styles.mobilePrimary} onClick={() => setMenuOpen(false)}>
                Get started
              </Link>
            </div>
          )}
        </nav>

        {/* HERO */}
        <section ref={heroRef} className={styles.heroSection}>
          <div className={styles.heroAmbient} aria-hidden>
            <div className={styles.lampGlow} />
            <div className={styles.lampGlowTwo} />
            <div className={styles.woodGrain} />
          </div>

          {/* Floating game pieces */}
          <motion.div
            className={styles.floatingPiece}
            style={{ top: '14%', left: '6%', y: heroY }}
            aria-hidden
          >
            <div className={styles.dice}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </motion.div>

          <motion.div
            className={styles.floatingPiece}
            style={{ top: '22%', right: '8%', y: heroY }}
            aria-hidden
          >
            <div className={styles.meeple} />
          </motion.div>

          <motion.div
            className={styles.floatingPiece}
            style={{ bottom: '18%', left: '10%' }}
            aria-hidden
          >
            <div className={styles.card}>
              <span className={styles.cardSuit}>♠</span>
              <span className={styles.cardRank}>A</span>
            </div>
          </motion.div>

          <motion.div
            className={styles.floatingPiece}
            style={{ bottom: '14%', right: '12%' }}
            aria-hidden
          >
            <div className={styles.hex}>
              <span>3</span>
            </div>
          </motion.div>

          <div className={styles.heroContent}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.eyebrow}
            >
              <Flame size={14} /> Game night, every night
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={styles.heroHeadline}
            >
              Welcome to the{' '}
              <span className={styles.gradientText}>New Player</span>
              <br />
              in Town
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className={styles.heroSub}
            >
              Decks and Dices is your board game cafe — browse our collection, learn the rules
              before you arrive, and climb the leaderboard to prove you&apos;re the best in the house.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={styles.heroWhisper}
            >
              Let&apos;s immerse in the games.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className={styles.heroCtas}
            >
              <Link href="/sign-up" className={styles.ctaPrimary}>
                Get started free <ArrowRight size={16} />
              </Link>
              <Link href="/sign-in" className={styles.ctaGhost}>
                Sign in
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className={styles.heroStats}
            >
              <div className={styles.stat}>
                <strong>7</strong>
                <span>curated games</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>2–8</strong>
                <span>players per table</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <strong>∞</strong>
                <span>bragging rights</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURES — BENTO */}
        <section id="games" className={styles.section}>
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <span className={styles.kicker}>Everything you need before you sit down</span>
            <h2 className={styles.sectionTitle}>
              The cafe, in your <span className={styles.gradientText}>pocket</span>
            </h2>
            <p className={styles.sectionLead}>
              Three simple things, designed to make every visit feel like a victory lap.
            </p>
          </motion.div>

          <div className={styles.bentoGrid}>
            <motion.div
              {...fadeUp}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`${styles.bentoCard} ${styles.bentoCardFeatured}`}
            >
              <div className={styles.featuredInner}>
                <div className={styles.cardIcon}>
                  <Search size={22} strokeWidth={2.2} />
                </div>
                <h3 className={styles.cardTitle}>Discover what&apos;s waiting for you</h3>
                <p className={styles.cardBody}>
                  Browse the full collection with cover art, player counts, and playtimes — so you
                  and your group walk in with a plan instead of arguing at the shelf for twenty
                  minutes.
                </p>
                <div className={styles.miniShelf} aria-hidden>
                  <div className={styles.miniGame}>
                    <span className={styles.miniGameTitle}>Catan</span>
                    <span className={styles.miniGameMeta}>3–4 · 90m</span>
                  </div>
                  <div className={styles.miniGame}>
                    <span className={styles.miniGameTitle}>Splendor</span>
                    <span className={styles.miniGameMeta}>2–4 · 30m</span>
                  </div>
                  <div className={styles.miniGame}>
                    <span className={styles.miniGameTitle}>Carcassonne</span>
                    <span className={styles.miniGameMeta}>2–5 · 45m</span>
                  </div>
                  <div className={styles.miniGame}>
                    <span className={styles.miniGameTitle}>Wingspan</span>
                    <span className={styles.miniGameMeta}>1–5 · 70m</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`${styles.bentoCard} ${styles.bentoCardOutlined}`}
            >
              <div className={styles.cardIcon}>
                <BookOpen size={22} strokeWidth={2.2} />
              </div>
              <h3 className={styles.cardTitle}>Learn the rules in minutes</h3>
              <p className={styles.cardBody}>
                Step-by-step guides for every game on the shelf. Spend your cafe time playing,
                not deciphering a rulebook.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`${styles.bentoCard} ${styles.bentoCardSolid}`}
            >
              <div className={styles.cardIconLight}>
                <Trophy size={22} strokeWidth={2.2} />
              </div>
              <h3 className={styles.cardTitleLight}>Claim your spot on the leaderboard</h3>
              <p className={styles.cardBodyLight}>
                Log every win. Let everyone know who really rules the table at Decks and Dices.
              </p>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.section}>
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <span className={styles.kicker}>How it works</span>
            <h2 className={styles.sectionTitle}>
              Three rolls of the <span className={styles.gradientText}>dice</span>
            </h2>
          </motion.div>

          <div className={styles.steps}>
            {[
              {
                n: '01',
                title: 'Browse the shelf',
                body: 'Open the catalog, scroll through every game we stock, and pick the ones that match your group&apos;s mood and player count.',
              },
              {
                n: '02',
                title: 'Learn before you arrive',
                body: 'Tap any game to read the rules, see real photos of the table, and know exactly how a round flows before you sit down.',
              },
              {
                n: '03',
                title: 'Log your wins',
                body: 'After your visit, log every win you scored. Watch your name rise up the house leaderboard — and bring friends to defend it.',
              },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={styles.step}
              >
                <span className={styles.stepNum}>{s.n}</span>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p
                    className={styles.stepBody}
                    dangerouslySetInnerHTML={{ __html: s.body }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRODUCT SHOWCASE */}
        <section id="leaderboard" className={styles.section}>
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <span className={styles.kicker}>Take a peek</span>
            <h2 className={styles.sectionTitle}>
              See who gets on top of the <span className={styles.gradientText}>leaderboard</span>
            </h2>
            <p className={styles.sectionLead}>
              A live look at what you&apos;ll find inside — the shelf, the rules, and the rankings.
            </p>
          </motion.div>

          <div className={styles.showcase}>
            <button
              className={styles.showcaseArrow}
              onClick={() => setActiveFrame((f) => (f - 1 + frames.length) % frames.length)}
              aria-label="Previous frame"
            >
              <ChevronLeft size={20} />
            </button>

            <div className={styles.browserFrame}>
              <div className={styles.browserBar}>
                <span className={`${styles.dot} ${styles.dotR}`} />
                <span className={`${styles.dot} ${styles.dotY}`} />
                <span className={`${styles.dot} ${styles.dotG}`} />
                <span className={styles.urlBar}>decksanddice.cafe/{frames[activeFrame].type}</span>
              </div>
              <div className={styles.browserBody}>
                {frames[activeFrame].type === 'catalog' && <CatalogMock />}
                {frames[activeFrame].type === 'rules' && <RulesMock />}
                {frames[activeFrame].type === 'leaderboard' && <LeaderboardMock />}
              </div>
              <div className={styles.frameCaption}>
                <strong>{frames[activeFrame].title}.</strong> {frames[activeFrame].caption}
              </div>
            </div>

            <button
              className={styles.showcaseArrow}
              onClick={() => setActiveFrame((f) => (f + 1) % frames.length)}
              aria-label="Next frame"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className={styles.dots}>
            {frames.map((_, i) => (
              <button
                key={i}
                className={`${styles.dotNav} ${i === activeFrame ? styles.dotNavActive : ''}`}
                onClick={() => setActiveFrame(i)}
                aria-label={`Frame ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className={styles.ctaBand}>
          <motion.div
            {...fadeUp}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={styles.ctaInner}
          >
            <Sparkles size={28} className={styles.ctaSparkle} />
            <h2 className={styles.ctaHeadline}>
              The next round is on us. <br />
              <span className={styles.gradientText}>Pull up a chair.</span>
            </h2>
            <p className={styles.ctaSub}>
              Free forever. Sign up in thirty seconds and start logging wins tonight.
            </p>
            <Link href="/sign-up" className={styles.ctaPrimaryLg}>
              Get started free <ArrowRight size={18} />
            </Link>
            <p className={styles.ctaFinePrint}>No credit card. No catch. Just good games.</p>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div>
              <div className={styles.brand}>
                <span className={styles.brandIcon} aria-hidden>
                  <Dice5 size={20} strokeWidth={2.4} />
                </span>
                <span className={styles.brandName}>{APP_NAME}</span>
              </div>
              <p className={styles.footerTag}>Your neighborhood board game cafe — online.</p>
            </div>
            <div className={styles.footerLinks}>
              <Link href="#games" className={styles.footerLink}>The Shelf</Link>
              <Link href="#leaderboard" className={styles.footerLink}>Leaderboard</Link>
              <Link href="/sign-in" className={styles.footerLink}>Sign in</Link>
            </div>
          </div>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} {APP_NAME}. Roll well.
          </div>
        </footer>
      </div>
    </div>
  )
}

function CatalogMock() {
  const games = [
    { name: 'Catan', meta: '3–4 · 90m', tone: 'a' },
    { name: 'Splendor', meta: '2–4 · 30m', tone: 'b' },
    { name: 'Carcassonne', meta: '2–5 · 45m', tone: 'c' },
    { name: 'Wingspan', meta: '1–5 · 70m', tone: 'a' },
    { name: 'Azul', meta: '2–4 · 40m', tone: 'b' },
    { name: 'Ticket to Ride', meta: '2–5 · 60m', tone: 'c' },
  ]
  return (
    <div className={styles.mockCatalog}>
      {games.map((g) => (
        <div key={g.name} className={`${styles.mockCard} ${styles[`tone${g.tone.toUpperCase()}`]}`}>
          <div className={styles.mockCover} />
          <div className={styles.mockCardBody}>
            <span className={styles.mockGameName}>{g.name}</span>
            <span className={styles.mockGameMeta}>
              <Users size={11} /> {g.meta.split('·')[0]} · <Clock size={11} /> {g.meta.split('·')[1]}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function RulesMock() {
  return (
    <div className={styles.mockRules}>
      <div className={styles.mockRulesHeader}>
        <div className={styles.mockRulesCover} />
        <div>
          <span className={styles.mockRulesTitle}>Splendor</span>
          <span className={styles.mockRulesMeta}>2–4 players · 30 min · Easy</span>
        </div>
      </div>
      <div className={styles.mockRulesSection}>
        <span className={styles.mockRulesLabel}>How to play</span>
        <div className={styles.mockLine} style={{ width: '92%' }} />
        <div className={styles.mockLine} style={{ width: '78%' }} />
        <div className={styles.mockLine} style={{ width: '88%' }} />
        <div className={styles.mockLine} style={{ width: '65%' }} />
      </div>
      <div className={styles.mockRulesSection}>
        <span className={styles.mockRulesLabel}>Top players here</span>
        <div className={styles.mockMiniBoard}>
          <div>1. Priya</div>
          <div>2. Arjun</div>
          <div>3. Maya</div>
        </div>
      </div>
    </div>
  )
}

function LeaderboardMock() {
  const rows = [
    { rank: 1, name: 'Priya M.', wins: 47 },
    { rank: 2, name: 'Arjun K.', wins: 39 },
    { rank: 3, name: 'Maya R.', wins: 33 },
    { rank: 4, name: 'Dev S.', wins: 28 },
    { rank: 5, name: 'Riya T.', wins: 24 },
  ]
  return (
    <div className={styles.mockLb}>
      <div className={styles.mockLbHeader}>
        <Crown size={14} /> House Leaderboard
      </div>
      {rows.map((r) => (
        <div key={r.rank} className={`${styles.mockLbRow} ${r.rank === 1 ? styles.mockLbTop : ''}`}>
          <span className={styles.mockLbRank}>{r.rank}</span>
          <span className={styles.mockLbName}>{r.name}</span>
          <span className={styles.mockLbWins}>{r.wins} wins</span>
        </div>
      ))}
    </div>
  )
}
