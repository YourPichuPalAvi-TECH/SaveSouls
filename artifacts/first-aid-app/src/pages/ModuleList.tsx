import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useListModules, useGetProgress } from "@workspace/api-client-react";
import { Shell, TopBar } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FullPageLoader } from "@/components/ui/spinner";
import { getModuleIcon } from "./Home";
import { Clock } from "lucide-react";

export default function ModuleList() {
  const { data: modules, isLoading: loadingModules } = useListModules();
  const { data: progress, isLoading: loadingProgress } = useGetProgress();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    if (!modules) return ["All"];
    const cats = new Set(modules.map(m => m.category));
    return ["All", ...Array.from(cats)].sort();
  }, [modules]);

  const filteredModules = useMemo(() => {
    if (!modules) return [];
    if (activeCategory === "All") return modules;
    return modules.filter(m => m.category === activeCategory);
  }, [modules, activeCategory]);

  if (loadingModules || loadingProgress) {
    return <FullPageLoader />;
  }

  return (
    <Shell>
      <TopBar title="Library" />
      <div className="px-4 py-6">
        
        {/* Filter Pills */}
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 gap-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? "bg-foreground text-background" 
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              data-testid={`filter-${category}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-4 mt-2 pb-8">
          {filteredModules.map(module => {
            const Icon = getModuleIcon(module.iconName);
            const moduleProgress = progress?.filter(p => p.moduleId === module.id) || [];
            const percentComplete = module.totalLessons > 0 
                ? Math.round((moduleProgress.length / module.totalLessons) * 100) 
                : 0;

            return (
              <Link key={module.id} href={`/modules/${module.id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer" data-testid={`module-list-item-${module.id}`}>
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex items-center gap-4 p-5 sm:flex-1">
                        <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-muted text-foreground">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">{module.category}</span>
                            <Badge variant="outline" className="text-[10px]">{module.difficulty}</Badge>
                          </div>
                          <h3 className="font-serif font-bold text-xl mb-1">{module.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {module.estimatedMinutes} min
                            </span>
                            <span>•</span>
                            <span>{module.totalLessons} lessons</span>
                          </div>
                        </div>
                      </div>
                      
                      {percentComplete > 0 && (
                        <div className="bg-muted/30 p-4 sm:w-48 sm:border-l sm:border-t-0 border-t flex flex-col justify-center">
                          <div className="flex justify-between text-xs font-medium text-foreground mb-2">
                            <span>Progress</span>
                            <span>{percentComplete}%</span>
                          </div>
                          <Progress value={percentComplete} className="h-2" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          
          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No modules found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
