import { useState } from 'react';

export const useLegacyCleanup = () => {
  const [active, setActive] = useState(false);
  return { active, setActive };
};
