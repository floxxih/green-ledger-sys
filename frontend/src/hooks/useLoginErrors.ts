import { useState } from 'react';

export const useLoginErrors = () => {
  const [active, setActive] = useState(false);
  return { active, setActive };
};
