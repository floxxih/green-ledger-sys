import { useState } from 'react';

export const useAuthExamples = () => {
  const [active, setActive] = useState(false);
  return { active, setActive };
};
