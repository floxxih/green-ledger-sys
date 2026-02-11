import { useState } from 'react';

export const useDarkMode = () => {
  const [active, setActive] = useState(false);
  return { active, setActive };
};
