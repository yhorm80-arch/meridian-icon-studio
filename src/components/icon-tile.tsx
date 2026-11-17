import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconTone = "violet" | "mint" | "blush" | "amber" | "sky" | "rose";

type IconTileProps = {
  icon: LucideIcon;
  tone?: IconTone;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

/** Flat duotone 2D icon set inside a softly tinted tile. Colors come from --tone-* tokens. */
export function IconTile({ icon: Icon, tone = "violet", size = "sm", className }: IconTileProps) {
  return (
    <span className={cn("icon-tile", `tone-${tone}`, `icon-tile-${size}`, className)} aria-hidden="true">
      <Icon />
    </span>
  );
}
