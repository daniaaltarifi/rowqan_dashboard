import { useEffect } from 'react';
import Cookies from 'js-cookie';

const DirectionHandler = () => {
  const lang = Cookies.get('lang') || 'en'; 
  useEffect(() => {
    document.body.classList.remove('ltr', 'rtl'); 
    document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr');
  }, [lang]);

  return null;
};

export default DirectionHandler;
