import { useState, useRef, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { 
  useGetLesson, 
  useListLessons, 
  useMarkLessonComplete,
  getGetProgressQueryKey,
  getGetProgressSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Shell, TopBar } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { FullPageLoader } from "@/components/ui/spinner";
import { AlertTriangle, Lightbulb, ChevronLeft, ChevronRight, Check } from "lucide-react";

export default function LessonView() {
  const [, setLocation] = useLocation();
  const { moduleId, lessonId } = useParams<{ moduleId: string, lessonId: string }>();
  const modId = parseInt(moduleId, 10);
  const lesId = parseInt(lessonId, 10);
  const queryClient = useQueryClient();

  const { data: lesson, isLoading: loadingLesson } = useGetLesson(lesId, { query: { enabled: !!lesId } });
  const { data: lessons, isLoading: loadingLessons } = useListLessons(modId, { query: { enabled: !!modId } });
  const markComplete = useMarkLessonComplete();

  const [isMarking, setIsMarking] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lesId]);

  if (loadingLesson || loadingLessons) {
    return <FullPageLoader />;
  }

  if (!lesson || !lessons) {
    return (
      <Shell>
        <TopBar backTo={`/modules/${modId}`} />
        <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>
      </Shell>
    );
  }

  const currentIndex = lessons.findIndex(l => l.id === lesId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleCompleteAndContinue = async () => {
    if (isMarking) return;
    setIsMarking(true);
    
    try {
      await markComplete.mutateAsync({ lessonId: lesId });
      // Invalidate progress queries so dashboard and module detail update
      queryClient.invalidateQueries({ queryKey: getGetProgressQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetProgressSummaryQueryKey() });
      
      if (nextLesson) {
        setLocation(`/modules/${modId}/lessons/${nextLesson.id}`);
      } else {
        // Last lesson, go to quiz
        setLocation(`/modules/${modId}/quiz`);
      }
    } catch (error) {
      console.error("Failed to mark lesson complete", error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <Shell>
      <TopBar 
        backTo={`/modules/${modId}`} 
        title={`Lesson ${currentIndex + 1} of ${lessons.length}`} 
      />
      
      <div className="px-4 py-6 max-w-2xl mx-auto pb-32">
        <h1 className="text-3xl font-serif font-bold text-foreground mb-8 leading-tight">
          {lesson.title}
        </h1>

        {lesson.warningNote && (
          <div className="mb-8 rounded-xl border border-accent bg-accent/10 p-5 flex gap-4">
            <div className="mt-0.5">
              <AlertTriangle className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h4 className="font-bold text-accent-foreground mb-1">Crucial Warning</h4>
              <p className="text-sm text-accent-foreground/90 font-medium leading-relaxed">{lesson.warningNote}</p>
            </div>
          </div>
        )}

        <div 
          ref={contentRef}
          className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary mb-10"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />

        {lesson.tips && lesson.tips.length > 0 && (
          <div className="my-10 rounded-xl bg-secondary/5 border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="font-serif font-bold text-lg">Key Takeaways</h3>
            </div>
            <ul className="space-y-3">
              {lesson.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t p-4 md:left-20">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          {prevLesson ? (
            <Link href={`/modules/${modId}/lessons/${prevLesson.id}`}>
              <Button variant="ghost" size="icon" className="shrink-0" data-testid="button-prev-lesson">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <div className="w-10" /> // Spacer
          )}

          <Button 
            className="flex-1 shadow-lg" 
            size="lg"
            onClick={handleCompleteAndContinue}
            disabled={isMarking}
            data-testid="button-complete-lesson"
          >
            {isMarking ? (
              <span className="animate-pulse">Saving...</span>
            ) : nextLesson ? (
              <>
                Complete & Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Finish & Take Quiz
              </>
            )}
          </Button>
        </div>
      </div>
    </Shell>
  );
}
