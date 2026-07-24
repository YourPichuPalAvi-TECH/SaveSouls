import { Link } from "wouter";
import { useGetProgressSummary, useListModules, useGetProgress } from "@workspace/api-client-react";
import { Shell, TopBar } from "@/components/layout/Shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FullPageLoader } from "@/components/ui/spinner";
import { Flame, Award, BookOpen, Target } from "lucide-react";

export default function ProgressPage() {
  const { data: summary, isLoading: loadingSummary } = useGetProgressSummary();
  const { data: modules, isLoading: loadingModules } = useListModules();
  const { data: progress, isLoading: loadingProgress } = useGetProgress();

  if (loadingSummary || loadingModules || loadingProgress) {
    return <FullPageLoader />;
  }

  if (!summary || !modules) return null;

  const totalProgressPercent = summary.totalLessons > 0 
    ? Math.round((summary.completedLessons / summary.totalLessons) * 100) 
    : 0;

  return (
    <Shell>
      <TopBar title="Your Progress" />
      <div className="px-4 py-6 pb-24">
        
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-primary text-primary-foreground border-transparent">
            <CardContent className="p-5 flex flex-col items-center text-center justify-center h-full">
              <Flame className={`w-8 h-8 mb-2 ${summary.streakDays > 0 ? 'text-accent' : 'opacity-50'}`} />
              <div className="text-3xl font-bold font-serif mb-1">{summary.streakDays}</div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-80">Day Streak</div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-serif">{summary.averageQuizScore ? `${Math.round(summary.averageQuizScore)}%` : '--'}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg Score</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold font-serif">{summary.completedModules} / {summary.totalModules}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Modules</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Global Progress */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-serif font-bold text-primary">{totalProgressPercent}%</span>
              <span className="text-sm font-medium text-muted-foreground pb-1">{summary.completedLessons} of {summary.totalLessons} lessons</span>
            </div>
            <Progress value={totalProgressPercent} className="h-3" />
          </CardContent>
        </Card>

        {/* Module Breakdown */}
        <h2 className="text-xl font-serif font-bold mb-4">Module Breakdown</h2>
        <div className="space-y-4">
          {modules.map(module => {
            const moduleProgress = progress?.filter(p => p.moduleId === module.id) || [];
            const percentComplete = module.totalLessons > 0 
                ? Math.round((moduleProgress.length / module.totalLessons) * 100) 
                : 0;
            
            return (
              <Link key={module.id} href={`/modules/${module.id}`}>
                <div className="bg-card border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-colors" data-testid={`progress-module-${module.id}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-foreground">{module.title}</h3>
                    <span className="text-sm font-bold text-primary">{percentComplete}%</span>
                  </div>
                  <Progress value={percentComplete} className="h-1.5" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </Shell>
  );
}
