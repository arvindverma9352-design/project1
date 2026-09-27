import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Also scroll body and root just in case
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    const root = document.getElementById('root');
    if(root) root.scrollTop = 0;
    
    // Use timeout to ensure layout is done
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
  }, [pathname]);

  return null;
}
