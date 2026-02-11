import { useLegacyCleanup } from '../../hooks/useLegacyCleanup';

interface LegacyCleanupProps {
  className?: string;
  id?: string;
}

export default function LegacyCleanup = ({ className }: LegacyCleanupProps) => {
  const { active } = useLegacyCleanup();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Legacy API Cleanup</h2>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
