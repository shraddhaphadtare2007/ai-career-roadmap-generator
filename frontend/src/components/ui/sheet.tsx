import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | null>(null);

export const Sheet: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open = false, onOpenChange = () => {}, children }) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger: React.FC<{
  asChild?: boolean;
  children: React.ReactNode;
}> = ({ children }) => {
  const ctx = React.useContext(SheetContext);
  return (
    <div onClick={() => ctx?.onOpenChange(true)} className="inline-block cursor-pointer">
      {children}
    </div>
  );
};

export const SheetContent: React.FC<{
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}> = ({ side = "left", className, children }) => {
  const ctx = React.useContext(SheetContext);
  if (!ctx?.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => ctx.onOpenChange(false)}
      />
      {/* Panel */}
      <div
        className={cn(
          "relative z-50 flex h-full w-72 flex-col bg-slate-950 p-6 shadow-2xl border-r border-slate-800 transition-transform duration-300",
          side === "left" ? "left-0" : "right-0 ml-auto border-l border-r-0",
          className
        )}
      >
        <button
          onClick={() => ctx.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const SheetTitle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <h2 className={cn("text-lg font-semibold text-white", className)}>{children}</h2>
);
