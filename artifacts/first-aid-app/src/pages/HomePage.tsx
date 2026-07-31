import { Link } from "wouter";
import { Shell, TopBar } from "@/components/layout/Shell";
import { ArrowRight, Heart, ExternalLink, BookOpen, Shield } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════
//  ✏️  EDIT THIS FILE to change your home page
//  Everything you'd want to change lives in the CONTENT object below.
//  Save the file and the page updates instantly — no other files needed.
// ═══════════════════════════════════════════════════════════════════
const CONTENT = {

  // ── Top bar title (small text in the header) ──
  pageTitle: "SaveSouls",

  // ── Hero card ──
  heroTagline: "Every second counts.",
  heroHeadline: "Learn to save a life — before you ever need to.",
  heroBody:
    "SaveSouls is a free first aid and EMT training platform built for everyday people and first responders. No cost. No sign-up. Just knowledge that saves lives.",
  heroButtonText: "Start Training",
  heroButtonLink: "/dashboard",   // where the button goes

  // ── Donation section ──
  donationHeading: "Support the Mission",
  donationBody:
    "SaveSouls is kept free by community donations. Your contribution helps us reach schools, rural communities, and neighborhoods where emergency response is slowest.",
  donationButtonText: "Donate",
  donationUrl: "https://www.gofundme.com/",   // ← paste your donation link here

  // ── Three feature cards ──
  features: [
    {
      icon: BookOpen,
      title: "13 Free Courses",
      body: "From CPR basics to advanced EMT topics — all written to real clinical standards.",
    },
    {
      icon: Shield,
      title: "Two Training Tracks",
      body: "Civilian First Aid for everyday emergencies. EMT Training for certification prep.",
    },
    {
      icon: Heart,
      title: "Built for Everyone",
      body: "No experience required. Start with the basics and work your way up at your own pace.",
    },
  ],

  // ── About section ──
  aboutHeading: "About Save Souls",
  aboutBody:
    "Save Souls was founded on one belief: the knowledge to save a life should never be out of reach. We partner with medical professionals to produce accurate, up-to-date training content and make it available to anyone with an internet connection.",
  aboutLinkText: "Learn more about our program →",
  aboutLinkHref: "/about",

};
// ═══════════════════════════════════════════════════════════════════

export default function HomePage() {
  return (
    <Shell>
      <TopBar title={CONTENT.pageTitle} />

      <div className="px-4 py-6 space-y-6 pb-28">

        {/* ── Hero ── */}
        <section className="rounded-2xl bg-primary text-primary-foreground p-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-widest opacity-75">
            {CONTENT.heroTagline}
          </p>
          <h1 className="font-serif text-3xl font-bold leading-tight">
            {CONTENT.heroHeadline}
          </h1>
          <p className="text-sm opacity-85 leading-relaxed">
            {CONTENT.heroBody}
          </p>
          <Link href={CONTENT.heroButtonLink}>
            <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-white text-primary px-6 py-2.5 text-sm font-semibold shadow hover:bg-white/90 transition-colors">
              {CONTENT.heroButtonText} <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </section>

        {/* ── Feature cards ── */}
        <section className="space-y-3">
          {CONTENT.features.map((f) => (
            <div key={f.title} className="flex gap-4 rounded-xl bg-background border p-5">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-0.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Donation CTA ── */}
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 space-y-3 dark:bg-rose-950/20 dark:border-rose-900">
          <div className="flex items-center gap-2 font-semibold text-rose-700 dark:text-rose-400">
            <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            {CONTENT.donationHeading}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {CONTENT.donationBody}
          </p>
          <a
            href={CONTENT.donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 text-sm font-semibold shadow transition-colors"
          >
            {CONTENT.donationButtonText}
            <ExternalLink className="h-4 w-4" />
          </a>
        </section>

        {/* ── About section ── */}
        <section className="rounded-xl bg-background border p-6 space-y-3">
          <h2 className="font-serif text-lg font-semibold">{CONTENT.aboutHeading}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{CONTENT.aboutBody}</p>
          <Link href={CONTENT.aboutLinkHref}>
            <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
              {CONTENT.aboutLinkText}
            </span>
          </Link>
        </section>

      </div>
    </Shell>
  );
}
