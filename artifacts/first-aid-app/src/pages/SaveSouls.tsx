import { Shell, TopBar } from "@/components/layout/Shell";
import { Link } from "wouter";
import { Heart, BookOpen, Users, ArrowRight, ExternalLink } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  EDIT THIS SECTION to update your page content and donation link
// ─────────────────────────────────────────────────────────────────
const CONTENT = {
  // Hero section
  tagline: "Every Second Counts.",
  headline: "Save Souls trains everyday people and first responders to act with confidence in any emergency.",
  heroDescription:
    "We believe that life-saving knowledge shouldn't be locked behind expensive courses. SaveSouls makes high-quality first aid and EMT training free and accessible to everyone.",

  // Donation section
  donationHeading: "Help Us Reach More People",
  donationBody:
    "Your donation keeps this platform free for communities that need it most — schools, rural areas, and low-income neighborhoods where emergency response times are longest.",
  donationButtonText: "Donate to SaveSouls",
  // ↓ Replace this URL with your actual donation page (GoFundMe, PayPal, etc.)
  donationUrl: "https://www.gofundme.com/",

  // Mission pillars (icon options: Heart / BookOpen / Users — choose any lucide-react icon)
  pillars: [
    {
      icon: BookOpen,
      title: "Real Clinical Content",
      body: "Our lessons are written to actual BLS and EMT-B standards, not watered-down summaries. Learn what works in the field.",
    },
    {
      icon: Users,
      title: "Built for Everyone",
      body: "Two tracks: Civilian First Aid for everyday emergencies, and EMT Training for those pursuing professional certification.",
    },
    {
      icon: Heart,
      title: "Free, Always",
      body: "No paywalls, no subscriptions. SaveSouls is a nonprofit mission funded entirely by community donations.",
    },
  ],

  // Stats bar
  stats: [
    { value: "13", label: "Courses" },
    { value: "52", label: "Lessons" },
    { value: "2", label: "Tracks" },
    { value: "Free", label: "Forever" },
  ],
};
// ─────────────────────────────────────────────────────────────────

export default function SaveSoulsPage() {
  return (
    <Shell>
      <TopBar title="SaveSouls" />

      <div className="px-4 py-6 space-y-10 pb-24">

        {/* ── Hero ── */}
        <section className="rounded-2xl bg-primary text-primary-foreground p-8 space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest opacity-80">
            {CONTENT.tagline}
          </p>
          <h1 className="font-serif text-3xl font-bold leading-tight">
            {CONTENT.headline}
          </h1>
          <p className="text-base opacity-85 leading-relaxed">
            {CONTENT.heroDescription}
          </p>
          <Link href="/modules">
            <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-white text-primary px-6 py-2.5 text-sm font-semibold shadow hover:bg-white/90 transition-colors">
              Start Learning <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </section>

        {/* ── Stats ── */}
        <section className="grid grid-cols-4 gap-3">
          {CONTENT.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center rounded-xl bg-background border p-4 text-center">
              <span className="font-serif text-2xl font-bold text-primary">{s.value}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── Mission Pillars ── */}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-semibold">Our Mission</h2>
          {CONTENT.pillars.map((pillar) => (
            <div key={pillar.title} className="flex gap-4 rounded-xl bg-background border p-5">
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <pillar.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base mb-1">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Donation CTA ── */}
        <section className="rounded-2xl bg-rose-50 border border-rose-200 p-6 space-y-3 dark:bg-rose-950/20 dark:border-rose-900">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-semibold">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
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

      </div>
    </Shell>
  );
}
