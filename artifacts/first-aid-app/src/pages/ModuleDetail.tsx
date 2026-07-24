import { Link, useParams } from "wouter";
import { 
  useGetModule, 
  useListLessons, 
  useGetProgress,
  useGetModuleAttempts
} from "@workspace/api-client-react";
import { Shell, TopBar } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { FullPageLoader } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { getModuleIcon } from "./Home";
import { CheckCircle2, Circle, Clock, PlayCircle, Award, ArrowRight } from "lucide-react";

export default function ModuleDetail() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const id = parseInt(moduleId, 10);

  const { data: module, isLoading: loadingModule } = useGetModule(id, { query: { enabled: !!id } });
  const { data: lessons, isLoading: loadingLessons } = useListLessons(id, { query: { enabled: !!id } });
  const { data: progress, isLoading: loadingProgress } = useGetProgress();
  const { data: attempts, isLoading: loadingAttempts } = useGetModuleAttempts(id, { query: { enabled: !!id } });

  if (loadingModule || loadingLessons || loadingProgress || loadingAttempts) {
    return <FullPageLoader />;
  }

  if (!module || !lessons) {
    return (
      <Shell>
        <TopBar backTo="/modules" />
        <div className="p-8 text-center text-muted-foreground">Module not found.</div>
      </Shell>
    );
  }

  const Icon = getModuleIcon(module.iconName);
  
  // Progress calculations
  const moduleProgress = progress?.filter(p => p.moduleId === id) || [];
  const completedLessonIds = new Set(moduleProgress.map(p => p.lessonId));
  const isFullyCompleted = completedLessonIds.size === lessons.length && lessons.length > 0;
  
  // Find first uncompleted lesson
  const nextLesson = lessons.find(l => !completedLessonIds.has(l.id)) || lessons[0];
  
  // Best quiz score
  const bestAttempt = attempts?.reduce((best, current) => 
    current.score > best.score ? current : best
  , attempts[0]);

  return (
    <Shell>
      <TopBar backTo="/modules" />
      
      {/* Hero Section */}
      <div className="bg-secondary text-secondary-foreground pb-8 pt-6 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="border-secondary-foreground/20 text-secondary-foreground uppercase tracking-wider text-[10px]">
            {module.category}
          </Badge>
          <span className="text-secondary-foreground/60 text-xs font-medium uppercase tracking-wider">{module.difficulty}</span>
        </div>
        
        <h1 className="text-3xl font-serif font-bold mb-4">{module.title}</h1>
        <p className="text-secondary-foreground/80 text-base mb-6 max-w-prose leading-relaxed">
          {module.description}
        </p>
        
        <div className="flex items-center gap-6 text-sm font-medium text-secondary-foreground/90">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {module.estimatedMinutes} min
          </div>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-primary" />
            {lessons.length} lessons
          </div>
          {bestAttempt && (
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Best: {bestAttempt.percentage}%
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-8 -mt-6">
        {/* Action Card */}
        <div className="bg-background border rounded-xl shadow-lg p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-serif font-bold text-lg">
              {isFullyCompleted ? "Review Material" : "Continue Learning"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isFullyCompleted 
                ? "You've completed all lessons." 
                : `Next: ${nextLesson?.title || 'Start'}`}
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            {nextLesson && (
              <Link href={`/modules/${id}/lessons/${nextLesson.id}`} className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto" size="lg" data-testid="button-start-lesson">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  {completedLessonIds.size > 0 ? "Continue" : "Start"}
                </Button>
              </Link>
            )}
            
            {(isFullyCompleted || attempts && attempts.length > 0) && (
              <Link href={`/modules/${id}/quiz`} className="flex-1 sm:flex-none">
                <Button variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-take-quiz">
                  {bestAttempt ? "Retake Quiz" : "Take Quiz"}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Lesson List */}
        <h2 className="text-xl font-serif font-bold mb-4">Lessons</h2>
        <div className="space-y-3 pb-12">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            const isLocked = index > 0 && !completedLessonIds.has(lessons[index-1].id);
            
            return (
              <div 
                key={lesson.id} 
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                  isCompleted ? "bg-muted/30 border-muted" : 
                  isLocked ? "opacity-60 bg-muted/10" : "bg-card border-border hover:border-primary/50"
                }`}
              >
                <div className="mt-1 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className={`w-6 h-6 ${isLocked ? 'text-muted-foreground/30' : 'text-primary/30'}`} />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-base mb-1">{lesson.title}</h4>
                  {isCompleted ? (
                    <div className="text-xs font-medium text-primary">Completed</div>
                  ) : (
                    <div className="text-xs text-muted-foreground">{index + 1} of {lessons.length}</div>
                  )}
                </div>

                {!isLocked && (
                  <Link href={`/modules/${id}/lessons/${lesson.id}`}>
                    <div className="absolute inset-0 cursor-pointer rounded-xl" data-testid={`lesson-link-${lesson.id}`} />
                  </Link>
                )}
              </div>
            );
          })}
          
          {/* Quiz Entry */}
          <div className="relative flex items-center justify-between p-5 mt-6 rounded-xl bg-primary text-primary-foreground">
             <div className="flex items-center gap-4">
               <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                 <Award className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-serif font-bold text-lg">Module Quiz</h4>
                 <p className="text-primary-foreground/80 text-sm">Test your knowledge</p>
               </div>
             </div>
             <ArrowRight className="w-5 h-5 opacity-80" />
             <Link href={`/modules/${id}/quiz`}>
                <div className="absolute inset-0 cursor-pointer" data-testid="quiz-link-bottom" />
             </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
