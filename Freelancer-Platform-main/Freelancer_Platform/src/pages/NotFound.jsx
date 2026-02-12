import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    
      
        404</h1>
        Oops! Page not found</p>
        
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
