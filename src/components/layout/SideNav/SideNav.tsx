import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { SideNavProps } from "./SideNav.types";

export function SideNav({ items, activeId, onSelect }: SideNavProps) {
  return (
    <ScrollArea className="h-full bg-card">
      <nav className="flex flex-col gap-1 p-2">
        {items.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-status-inactive/20",
                  activeId === item.id && "bg-status-info/20 text-foreground",
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
    </ScrollArea>
  );
}
