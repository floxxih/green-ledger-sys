interface DarkModeProps {
  className?: string;
  id?: string;
}

export const DarkMode = ({ className }: DarkModeProps) => {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Dark Mode Toggle</h2>
    </div>
  );
};
