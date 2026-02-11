import { useDarkMode } from '../../hooks/useDarkMode';

interface DarkModeProps {
  className?: string;
  id?: string;
}

export const DarkMode = ({ className }: DarkModeProps) => {
  const { active } = useDarkMode();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Dark Mode Toggle</h2>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
