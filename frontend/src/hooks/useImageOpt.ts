import { useState } from 'react';

export const useImageOpt = () => {
  const [active, setActive] = useState(false);
  return { active, setActive };
};
