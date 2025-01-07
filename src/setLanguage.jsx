import Cookies from 'js-cookie';

// Function to set the language and adjust the page direction (LTR/RTL)
export const setLanguage = (lang) => {
  Cookies.set('lang', lang, { expires: 365 }); // Save lang preference for 1 year
  document.body.classList.remove('ltr', 'rtl'); // Remove existing classes
  document.body.classList.add(lang === 'ar' ? 'rtl' : 'ltr'); // Add appropriate direction class
};
