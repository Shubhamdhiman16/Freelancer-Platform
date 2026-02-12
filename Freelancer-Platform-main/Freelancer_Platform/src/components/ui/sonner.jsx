import { useTheme } from "next-themes";
import { Toaster , toast } from "sonner";



const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    
  );
};

export { Toaster, toast };
