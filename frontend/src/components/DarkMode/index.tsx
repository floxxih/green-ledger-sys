interface DarkModeProps {
  className?: string;
  id?: string;
}

export const DarkMode = ({ className }: DarkModeProps) => {
  return <div className={className}>Dark Mode Toggle</div>;
};
