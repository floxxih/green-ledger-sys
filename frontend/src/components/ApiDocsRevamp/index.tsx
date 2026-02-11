import { useApiDocsRevamp } from '../../hooks/useApiDocsRevamp';

interface ApiDocsRevampProps {
  className?: string;
  id?: string;
}

export default function ApiDocsRevamp = ({ className }: ApiDocsRevampProps) => {
  const { active } = useApiDocsRevamp();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">API Docs Revamp</h2>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
