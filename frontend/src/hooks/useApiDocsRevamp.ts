import { useState } from 'react';

export const useApiDocsRevamp = () => {
  const [active, setActive] = useState(false);
  return { active, setActive };
};
