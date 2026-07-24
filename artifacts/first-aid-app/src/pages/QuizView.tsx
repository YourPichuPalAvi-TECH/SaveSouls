import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { 
  useGetModule,
  useGetModuleQuiz,
  useSubmitQuizAttempt,
  getGetModuleAttemptsQueryKey,
  getGetProgressSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Shell, TopBar } from "@/components/layout/Shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FullPageLoader } from "@/components/ui/spinner";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Home } from "lucide-react";

type QuizState = 'intro' | 'question' | 'explanation' | 'results';

export default function QuizView() {
  const [, setLocation] = useLocation();
  const { moduleId } = useParams<{ moduleId: string }>();
  const id = parseInt(moduleId, 10);
  const queryClient = useQueryClient();

  const { data: module, isLoading: loadingModule } = useGetModule(id, { query: { enabled: !!id } });
  const { data: questions, isLoading: loadingQuestions } = useGetModuleQuiz(id, { query: { enabled: !!id } });
  const submitAttempt = useSubmitQuizAttempt();

  const [quizState, setQuizState] = useState<QuizState>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultData, setResultData] = useState<{ score: number, percentage: number, passed: boolean } | null>(null);

  if (loadingModule || loadingQuestions) return <FullPageLoader />;
  if (!module || !questions || questions.length === 0) {
    return (
      <Shell>
        <TopBar backTo={`/modules/${id}`} />
        <div className="p-8 text-center text-muted-foreground">Quiz not available.</div>
      </Shell>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressValue = ((currentIndex) / questions.length) * 100;

  const handleStart = () => setQuizState('question');

  const handleSelectOption = (idx: number) => {
    if (quizState !== 'question') return;
    setSelectedOption(idx);
    setQuizState('explanation');
  };

  const handleNext = async () => {
    if (selectedOption === null) return;
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setQuizState('question');
    } else {
      // Finish quiz
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (finalAnswers: number[]) => {
    setIsSubmitting(true);
    try {
      // Calculate local score just in case API fails
      let score = 0;
      finalAnswers.forEach((ans, i) => {
        if (ans === questions[i].correctAnswer) score++;
      });
      
      const result = await submitAttempt.mutateAsync({
        data: {
          moduleId: id,
          score,
          totalQuestions: questions.length,
          answers: finalAnswers
        }
      });
      
      setResultData(result);
      queryClient.invalidateQueries({ queryKey: getGetModuleAttemptsQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: getGetProgressSummaryQueryKey() });
      setQuizState('results');
    } catch (error) {
      console.error("Failed to submit quiz", error);
      // Show local result if offline/error
      let score = 0;
      finalAnswers.forEach((ans, i) => {
        if (ans === questions[i].correctAnswer) score++;
      });
      const pct = Math.round((score / questions.length) * 100);
      setResultData({ score, percentage: pct, passed: pct >= 80 });
      setQuizState('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setQuizState('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setResultData(null);
  };

  return (
    <Shell>
      {quizState !== 'results' && <TopBar backTo={`/modules/${id}`} />}
      
      <div className="px-4 py-8 max-w-xl mx-auto flex flex-col min-h-[calc(100vh-80px)]">
        
        {/* INTRO STATE */}
        {quizState === 'intro' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold mb-4">Knowledge Check</h1>
            <p className="text-muted-foreground mb-10 max-w-sm">
              You've completed the lessons. Now let's make sure you're ready to apply this in a real situation.
            </p>
            <div className="w-full bg-muted/50 rounded-xl p-6 mb-10 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Questions</span>
                <span className="font-bold">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Passing Score</span>
                <span className="font-bold text-primary">80%</span>
              </div>
            </div>
            <Button size="lg" className="w-full py-6 text-lg" onClick={handleStart} data-testid="button-start-quiz">
              Start Quiz
            </Button>
          </div>
        )}

        {/* QUESTION & EXPLANATION STATE */}
        {(quizState === 'question' || quizState === 'explanation') && (
          <div className="flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="mb-8">
              <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                <span>Question {currentIndex + 1} of {questions.length}</span>
              </div>
              <Progress value={progressValue} className="h-1.5 mb-6" />
              <h2 className="text-2xl font-serif font-bold leading-snug">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-3 mb-8 flex-1">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;
                const showStatus = quizState === 'explanation';
                
                let btnClass = "w-full justify-start text-left h-auto py-4 px-5 border-2 rounded-xl transition-all duration-300 text-base font-medium ";
                
                if (!showStatus) {
                  btnClass += "bg-card border-border hover:border-primary hover:bg-primary/5";
                } else {
                  if (isCorrect) {
                    btnClass += "bg-green-50 border-green-500 text-green-900";
                  } else if (isSelected && !isCorrect) {
                    btnClass += "bg-red-50 border-red-500 text-red-900";
                  } else {
                    btnClass += "bg-card border-border opacity-50";
                  }
                }

                return (
                  <button 
                    key={idx}
                    className={btnClass}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showStatus}
                    data-testid={`option-${idx}`}
                  >
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{option}</span>
                      {showStatus && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                      {showStatus && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation Area */}
            <div className={`mt-auto transition-all duration-500 ${quizState === 'explanation' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
              <div className={`p-5 rounded-xl mb-6 ${
                selectedOption === currentQuestion.correctAnswer 
                  ? "bg-green-100/50 border border-green-200" 
                  : "bg-red-100/50 border border-red-200"
              }`}>
                <h4 className={`font-bold mb-2 ${selectedOption === currentQuestion.correctAnswer ? "text-green-800" : "text-red-800"}`}>
                  {selectedOption === currentQuestion.correctAnswer ? "Correct!" : "Incorrect"}
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{currentQuestion.explanation}</p>
              </div>
              <Button 
                size="lg" 
                className="w-full" 
                onClick={handleNext}
                disabled={isSubmitting}
                data-testid="button-next-question"
              >
                {isSubmitting ? "Finishing..." : currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          </div>
        )}

        {/* RESULTS STATE */}
        {quizState === 'results' && resultData && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-xl ${resultData.passed ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
              <span className="text-4xl font-serif font-bold">{resultData.percentage}%</span>
            </div>
            
            <h1 className="text-3xl font-serif font-bold mb-2">
              {resultData.passed ? "Module Passed!" : "Needs Review"}
            </h1>
            
            <p className="text-muted-foreground mb-10 text-lg">
              You scored {resultData.score} out of {questions.length}.
              {resultData.passed ? " You're ready to act in this situation." : " Review the material and try again."}
            </p>

            <div className="w-full space-y-3">
              {resultData.passed ? (
                <Link href="/modules">
                  <Button size="lg" className="w-full py-6 text-lg">
                    Return to Library
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="w-full py-6 text-lg" onClick={resetQuiz}>
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake Quiz
                </Button>
              )}
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full py-6 text-lg">
                  <Home className="w-5 h-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
