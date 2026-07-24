import { Link } from "wouter";
import {
  ArrowRight, HeartPulse, Activity, Wind, AlertTriangle, ShieldPlus,
  Heart, Droplets, Flame, User, Bone, Thermometer,
  ClipboardList, ShieldAlert, Pill
} from "lucide-react";
import {
  useGetFeaturedModules,
  useGetProgressSummary,
  useGetProgress
} from "@workspace/api-client-react";
import { Shell, TopBar } from "@/components/layout/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FullPageLoader } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Module } from "@workspace/api-client-react/src/generated/api.schemas";

// Map icon names from DB to Lucide icons
export function getModuleIcon(name: string) {
  switch (name) {
    case 'Heart': return Heart;
    case 'HeartPulse': return HeartPulse;
    case 'Activity': return Activity;
    case 'Wind': return Wind;
    case 'AlertTriangle': return AlertTriangle;
    case 'ShieldPlus': return ShieldPlus;
    case 'Droplets': return Droplets;
    case 'Flame': return Flame;
    case 'User': return User;
    case 'Bone': return Bone;
    case 'Thermometer': return Thermometer;
    case 'ClipboardList': return ClipboardList;
    case 'ShieldAlert': return ShieldAlert;
    case 'Pill': return Pill;
    default: return Activity;
  }
}

function ModuleCard({ module, progress }: { module: Module; progress: Array<{ moduleId: number }> }) {
  const Icon = getModuleIcon(module.iconName);
  const moduleLessons = progress?.filter(p => p.moduleId === module.id) || [];
  const percentComplete = module.totalLessons > 0
    ? Math.round((moduleLessons.length / module.totalLessons) * 100)
    : 0;

  return (
    <Link href={`/modules/${module.id}`}>
      <Card className="hover:border-primary/50 transition-colors cursor-pointer group" data-testid={`card-module-${module.id}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif font-bold text-lg truncate pr-2 group-hover:text-primary transition-colors">{module.title}</h3>
                <Badge variant="outline" className="flex-shrink-0 text-[10px] uppercase tracking-wider">{module.difficulty}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{module.description}</p>

              {percentComplete > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>{percentComplete}% complete</span>
                    <span>{moduleLessons.length} / {module.totalLessons} lessons</span>
                  </div>
                  <Progress value={percentComplete} className="h-1.5" />
                </div>
              ) : (
                <div className="flex items-center text-sm font-medium text-primary mt-2">
                  <span>Start module</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  const { data: featuredModules, isLoading: loadingModules } = useGetFeaturedModules();
  const { data: progressSummary, isLoading: loadingSummary } = useGetProgressSummary();
  const { data: userProgress, isLoading: loadingProgress } = useGetProgress();

  if (loadingModules || loadingSummary || loadingProgress) {
    return <FullPageLoader />;
  }

  const summary = progressSummary || {
    totalModules: 0, completedModules: 0, totalLessons: 0,
    completedLessons: 0, quizzesTaken: 0, streakDays: 0, averageQuizScore: null
  };
  const modules = featuredModules || [];
  const progress = userProgress || [];

  const civilianModules = modules.filter(m => m.section === 'civilian');
  const emtModules = modules.filter(m => m.section === 'emt');

  return (
    <Shell>
      <TopBar />
      <div className="px-4 pb-8">
        <div className="pt-6 pb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Ready to act.</h1>
          <p className="text-muted-foreground text-lg">Build the confidence to save a life.</p>
        </div>

        {/* Progress Snapshot */}
        <section className="mb-10">
          <Card className="bg-secondary text-secondary-foreground border-transparent overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldPlus className="w-32 h-32" />
            </div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-xl text-white">Your Training</CardTitle>
              <CardDescription className="text-secondary-foreground/70">
                {summary.streakDays > 0 ? `${summary.streakDays} day streak. Keep it up.` : "Start learning today."}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-secondary-foreground/70">Lessons</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{summary.completedLessons}</span>
                    <span className="text-sm mb-1 text-secondary-foreground/50">/ {summary.totalLessons}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-secondary-foreground/70">Avg Score</span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">
                      {summary.averageQuizScore != null ? `${Math.round(summary.averageQuizScore)}%` : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Civilian First Aid */}
        {civilianModules.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-xl font-serif font-bold">Civilian First Aid</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Essential skills everyone should know</p>
              </div>
              <Link href="/modules?section=civilian">
                <div className="text-sm font-medium text-primary hover:underline cursor-pointer" data-testid="link-civilian-modules">
                  View all
                </div>
              </Link>
            </div>
            <div className="grid gap-4 mt-4">
              {civilianModules.map(module => (
                <ModuleCard key={module.id} module={module} progress={progress} />
              ))}
            </div>
          </section>
        )}

        {/* EMT Training */}
        {emtModules.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-xl font-serif font-bold">EMT Training</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Advanced pre-hospital care techniques</p>
              </div>
              <Link href="/modules?section=emt">
                <div className="text-sm font-medium text-primary hover:underline cursor-pointer" data-testid="link-emt-modules">
                  View all
                </div>
              </Link>
            </div>
            <div className="grid gap-4 mt-4">
              {emtModules.map(module => (
                <ModuleCard key={module.id} module={module} progress={progress} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Shell>
  );
}
