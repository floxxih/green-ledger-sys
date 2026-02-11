import { useAuthExamples } from '../../hooks/useAuthExamples';

interface AuthExamplesProps {
  className?: string;
  id?: string;
}

export default function AuthExamples = ({ className }: AuthExamplesProps) => {
  const { active } = useAuthExamples();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Auth Examples</h2>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
