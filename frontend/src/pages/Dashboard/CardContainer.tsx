import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CardContainerProps {
  title: string;
  children: React.ReactNode;
  actionLabel?: string;
  onActionClick?: () => void; 
  footer?: React.ReactNode;
}

export function CardContainer({ 
  title, 
  children, 
  actionLabel, 
  onActionClick,
  footer 
}: CardContainerProps) {
  return (
    <Card className="shadow-none border-gray-200 rounded-2xl overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-6 py-4">
        <CardTitle className="text-xs text-gray-400 tracking-widest uppercase">
          {title}
        </CardTitle>
        {actionLabel && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onActionClick}
            className="text-brand-base font-bold font-inter flex items-center gap-1 hover:bg-brand-base/5 rounded-lg transition-colors"
          >
            {actionLabel} <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {children}
        </div>
      </CardContent>
      {footer && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {footer}
        </div>
      )}
    </Card>
  );
}