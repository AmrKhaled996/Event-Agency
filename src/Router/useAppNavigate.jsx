import { useNavigate, useParams } from "react-router-dom";

export default function useAppNavigate() {
  const navigate = useNavigate();
  const { lang: paramLang } = useParams();
  
  // Fallback to localStorage or default if lang param is missing
  const lang = paramLang || localStorage.getItem("lang") || "ar";

  return (path, options) => {
    // Safety check for null/undefined/empty
    if (path === null || path === undefined || path === '') {
      console.warn('[useAppNavigate] Attempted to navigate to an empty, null, or undefined path');
      return;
    }

    // Handle numeric navigation (e.g., -1 for "go back")
    if (typeof path === 'number') {
      return navigate(path);
    }

    // Handle string paths
    if (typeof path === 'string') {
      // If it already has the lang prefix, navigate as is
      if (path.startsWith(`/${lang}/`) || path === `/${lang}`) {
        return navigate(path, options);
      }
      
      // Ensure path starts with /
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      return navigate(`/${lang}${normalizedPath}`, options);
    }

    // Handle object paths (react-router-dom To object)
    if (typeof path === 'object' && path !== null) {
      const pathname = path.pathname || '';
      
      // If it already has the lang prefix, navigate as is
      if (pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`) {
        return navigate(path, options);
      }
      
      const normalizedPathname = pathname.startsWith('/') 
        ? pathname 
        : `/${pathname}`;
        
      return navigate({
        ...path,
        pathname: `/${lang}${normalizedPathname}`
      }, options);
    }

    // Fallback: If it's something unexpected, log it and try to stringify or navigate safely
    console.warn('[useAppNavigate] Unsupported or malformed path passed:', typeof path, path);
    try {
      if (path && typeof path !== 'object') {
        const stringPath = String(path);
        const normalizedPath = stringPath.startsWith('/') ? stringPath : `/${stringPath}`;
        return navigate(`/${lang}${normalizedPath}`, options);
      }
      
      // Absolute safety: navigate to home if everything else fails
      console.error('[useAppNavigate] Final fallback to home page');
      return navigate(`/${lang}/`);
    } catch (err) {
      console.error('[useAppNavigate] Emergency navigation fallback failed:', err);
    }
  };
}

