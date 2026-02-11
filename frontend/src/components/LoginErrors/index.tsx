import { useLoginErrors } from '../../hooks/useLoginErrors';

interface LoginErrorsProps {
  className?: string;
  id?: string;
}

export const LoginErrors = ({ className }: LoginErrorsProps) => {
  const { active } = useLoginErrors();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Enhanced Login Errors</h2>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
