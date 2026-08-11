import { cn } from "@/lib/utils";

type ContainerWidth = "default" | "narrow" | "prose";

const widthClass: Record<ContainerWidth, string> = {
  default: "",
  narrow: "container--narrow",
  prose: "container--prose",
};

export function Container({
  width = "default",
  className,
  children,
}: {
  width?: ContainerWidth;
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("container", widthClass[width], className)}>{children}</div>;
}
