import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";



const AppToaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Toaster 
      theme={theme} 
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-500",
          actionButton: "group-[.toast]:bg-blue-500 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-slate-200",
        },
      }}
      {...props}
    />
  );
};

export { AppToaster };
