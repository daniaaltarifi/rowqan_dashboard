import { useEffect } from 'react';
import Cookies from 'js-cookie';

const DirectionHandler = () => {
  const lang = Cookies.get('lang') || 'en'; // Default to 'en' if no language is set in cookie

  useEffect(() => {
    document.body.classList.remove('ltr', 'rtl'); // Remove previous direction classes
    document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr'); // Add appropriate direction class
  }, [lang]);

  return null;
};

export default DirectionHandler;
