import { useState } from 'react';

export const useMobileFix = () => {
  const [active, setActive] = useState(false);
  return { active, setActive };
};
