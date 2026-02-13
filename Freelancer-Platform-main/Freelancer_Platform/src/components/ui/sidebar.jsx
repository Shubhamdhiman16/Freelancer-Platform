import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

const SidebarContext = React.createContext(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef(({ children, ...props }, ref) => (
  <SidebarContext.Provider value={{}}>
    <TooltipProvider delayDuration={0}>
      <div
        ref={ref}
        className="group/sidebar flex h-full w-full flex-col bg-background"
        {...props}
      >
        {children}
      </div>
    </TooltipProvider>
  </SidebarContext.Provider>
));
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef(({ children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile, open, setOpen } = useSidebar();

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent className="w-[--sidebar-width] bg-sidebar p-0 [--sidebar-width:var(--sidebar-width-icon)]" side="left">
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="group peer hidden md:block text-sidebar-foreground"
      {...props}
    >
      <div
        className={cn(
          "duration-200 flex h-svh w-[--sidebar-width] flex-col",
          "transition-all ease-in-out",
          open === false ? "ml-[-100%]" : "ml-0"
        )}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          }
        }
      >
        {children}
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="sm"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute inset-y -z-20 hidden w-4 transition-all ease-in-out hover:bg-sidebar-border md:flex",
        "[--sidebar-width:var(--sidebar-width-icon)]",
        "[--sidebar-rail-width:var(--sidebar-width-icon)]",
        "[--sidebar-rail-offset:calc(-1 * var(--sidebar-width))]",
        "group-data-[collapsible=off]:translate-x-0",
        "group-data-[collapsible=off]:after:left-full",
        "group-data-[collapsible=off]:after:w-sidebar-rail-width",
        "group-data-[collapsible=off]:after:h-full",
        "group-data-[collapsible=off]:after:content-['']",
        "group-data-[collapsible=off]:after:bg-sidebar-rail-background",
        "group-data-[collapsible=off]:hover:bg-sidebar-rail-background",
        className
      )}
      onClick={() => toggleSidebar()}
      {...props}
    >
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[collapsible=icon]:ml-[--sidebar-rail-offset]",
        "peer-data-[collapsible=icon]:mr-[--sidebar-rail-width]",
        className
      )}
      {...props}
    >
      {props.children}
    </main>
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    className={cn("mx-2 w-auto bg-sidebar-border", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
      className
    )}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col group", className)}
      {...props}
    >
      {props.children}
      {isMobile &&
        openMobile === true && (
          <div className="absolute left-0 top-0 z-20 flex h-full w-[--sidebar-width] bg-sidebar p-2">
            {props.children}
          </div>
        )}
    </div>
  );
});
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-label"
    className={cn(
      "duration-200 flex h-auto shrink-0 items-center rounded-md px-2 text-sm font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity,height] ease-linear focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-action"
    className={cn(
      "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:opacity-0 group-focus-within:opacity-100",
      className
    )}
    {...props}
  />
));
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn(
      "group/menu-item relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-sidebar-foreground outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "has-[data-sidebar=menu-action]:cursor-pointer",
      "has-[data-sidebar=menu-action]:bg-transparent",
      "has-[data-sidebar=menu-action]:hover:bg-sidebar-accent",
      "has-[data-sidebar=menu-action]:hover:text-sidebar-accent-foreground",
      className
    )}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const SidebarMenuButton = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    data-sidebar="menu-button"
    className={cn(
      "absolute right-1 top-1/2 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      "[[data-side=left]_&]:-translate-x-full",
      "[[data-side=right]_&]:translate-x-full",
      "[[data-side=left]_&]:hover:translate-x-1",
      "[[data-side=right]_&]:hover:translate-x-1",
      "group-focus-within:translate-x-0 group-focus-within:opacity-100",
      className
    )}
    {...props}
  />
));
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-action"
    className={cn(
      "absolute right-1 top-1/2 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      "[[data-side=left]_&]:-translate-x-full",
      "[[data-side=right]_&]:translate-x-full",
      "[[data-side=left]_&]:hover:translate-x-1",
      "[[data-side=right]_&]:hover:translate-x-1",
      "group-focus-within:translate-x-0 group-focus-within:opacity-100",
      className
    )}
    {...props}
  />
));
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground select-none pointer-events-none",
      "group-hover:opacity-100",
      className
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-skeleton"
    className={cn("h-8 w-full gap-2 rounded-md p-2", className)}
    {...props}
  >
    <div className="h-4 w-4 rounded-md animate-pulse bg-sidebar-accent/50" />
    <div className="h-4 w-[calc(100%-2rem)] rounded-md animate-pulse bg-sidebar-accent/50" />
  </div>
));
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarProvider = React.forwardRef(({ children, defaultOpen = false, ...props }, ref) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarContext.Provider value={{ open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar: () => setOpen((v) => !v) }}>
      <TooltipProvider delayDuration={0}>
        <div
          ref={ref}
          className="group/sidebar flex h-full w-full flex-col bg-background"
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

export {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarInset,
  SidebarInput,
  SidebarRail,
};
