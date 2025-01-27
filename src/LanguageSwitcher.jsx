import React from 'react';
import { setLanguage } from './setLanguage';
import {
    Button,
  } from "@material-tailwind/react";
const LanguageSwitcher = () => {
  const handleLanguageChange = (lang) => {
    setLanguage(lang); // Update the language when the user switches
    window.location.reload();
  };

  return (
    <div className="language-switcher">
      <Button
  className="bg-[#6DA6BA]  transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"onClick={() => handleLanguageChange('en')}>en</Button>
       <Button
  className="bg-[#F2C79D]  transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"onClick={() => handleLanguageChange('ar')}>ar</Button>
    </div>
  );
};

export default LanguageSwitcher;
