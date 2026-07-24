import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Shell } from "@/components/layout/Shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-destructive/5 border-destructive/20">
          <CardContent className="pt-6 text-center">
            <div className="flex mb-4 gap-2 text-destructive items-center justify-center">
              <AlertCircle className="h-8 w-8" />
              <h1 className="text-2xl font-serif font-bold">404 Page Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The page you requested does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
