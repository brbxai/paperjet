import * as React from "react";
import { InputProps } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

interface LabeledProps extends InputProps {
  label: string;
  helpText?: string;
  children: React.ReactNode;
}

const Labeled = ({ label, helpText, children }: LabeledProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label>{label}</Label>
        {helpText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>{helpText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </div>
  );
};

Labeled.displayName = "Labeled";

export { Labeled };
