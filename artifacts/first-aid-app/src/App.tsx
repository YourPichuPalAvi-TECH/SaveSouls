import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import HomePage from '@/pages/HomePage';
import Dashboard from '@/pages/Home';
import SaveSoulsPage from '@/pages/SaveSouls';
import ModuleList from '@/pages/ModuleList';
import ModuleDetail from '@/pages/ModuleDetail';
import LessonView from '@/pages/LessonView';
import QuizView from '@/pages/QuizView';
import ProgressPage from '@/pages/Progress';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/about" component={SaveSoulsPage} />
      <Route path="/modules" component={ModuleList} />
      <Route path="/modules/:moduleId" component={ModuleDetail} />
      <Route path="/modules/:moduleId/lessons/:lessonId" component={LessonView} />
      <Route path="/modules/:moduleId/quiz" component={QuizView} />
      <Route path="/progress" component={ProgressPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
