import { Link, useLocation } from "wouter";
import { BookOpen, Home, Award, ChevronLeft, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/dashboard", icon: GraduationCap, label: "Training" },
    { href: "/progress", icon: Award, label: "Progress" },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-muted/30 pb-16 md:pb-0 md:pl-20">
      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 z-50 hidden h-full w-20 flex-col items-center border-r bg-background py-6 md:flex">
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <BookOpen className="h-5 w-5" />
        </div>
        
        <div className="flex flex-col gap-6 w-full px-3">
          {navItems.map((item) => {
            const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg p-3 text-xs font-medium transition-colors hover:bg-muted cursor-pointer",
                    isActive
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`nav-desktop-${item.label.toLowerCase()}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto">{children}</main>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t bg-background px-4 md:hidden pb-safe">
        {navItems.map((item) => {
          const isActive = location === item.href || (location.startsWith(item.href) && item.href !== "/");
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 min-w-[64px] h-full cursor-pointer transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                <item.icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function TopBar({ title, backTo, action }: { title?: React.ReactNode, backTo?: string, action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {backTo && (
          <Link href={backTo}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors cursor-pointer -ml-2" data-testid="button-back">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </div>
          </Link>
        )}
        {title && <h1 className="text-lg font-serif font-medium">{title}</h1>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
