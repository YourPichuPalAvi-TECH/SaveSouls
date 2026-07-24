import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useListModules, useGetProgress } from "@workspace/api-client-react";
import { Shell, TopBar } from "@/components/layout/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FullPageLoader } from "@/components/ui/spinner";
import { getModuleIcon } from "./Home";
import { Clock, ShieldCheck, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

type Section = "civilian" | "emt";

export default function ModuleList() {
  const { data: modules, isLoading: loadingModules } = useListModules();
  const { data: progress, isLoading: loadingProgress } = useGetProgress();

  // Read ?section= from the query string so "View all" links from Home work
  const search = useSearch();
  const defaultSection: Section = search.includes("section=emt") ? "emt" : "civilian";
  const [activeSection, setActiveSection] = useState<Section>(defaultSection);

  useEffect(() => {
    if (search.includes("section=emt")) setActiveSection("emt");
    else if (search.includes("section=civilian")) setActiveSection("civilian");
  }, [search]);

  const filteredModules = useMemo(() => {
    if (!modules) return [];
    return modules.filter(m => m.section === activeSection);
  }, [modules, activeSection]);

  if (loadingModules || loadingProgress) {
    return <FullPageLoader />;
  }

  const tabs: { id: Section; label: string; description: string; icon: typeof ShieldCheck }[] = [
    {
      id: "civilian",
      label: "Civilian First Aid",
      description: "Essential skills everyone should know",
      icon: ShieldCheck,
    },
    {
      id: "emt",
      label: "EMT Training",
      description: "Advanced pre-hospital care techniques",
      icon: Stethoscope,
    },
  ];

  return (
    <Shell>
      <TopBar title="Library" />
      <div className="px-4 py-6">

        {/* Section Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-muted rounded-xl">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`section-tab-${tab.id}`}
              >
                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                <span className="font-semibold text-xs sm:text-sm">{tab.label}</span>
                <span className="text-[10px] text-muted-foreground hidden sm:block">{tab.description}</span>
              </button>
            );
          })}
        </div>

        {/* Section header */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {activeSection === "civilian"
              ? `${filteredModules.length} modules · Life-saving basics for everyone`
              : `${filteredModules.length} modules · Pre-hospital care and clinical skills`}
          </p>
        </div>

        {/* Module list */}
        <div className="grid gap-4 pb-8">
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
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{module.description}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {module.estimatedMinutes} min
                            </span>
                            <span>·</span>
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
              <p className="text-muted-foreground">No modules found.</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
