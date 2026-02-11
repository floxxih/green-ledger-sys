import { useMobileFix } from '../../hooks/useMobileFix';

interface MobileFixProps {
  className?: string;
  id?: string;
}

export default function MobileFix = ({ className }: MobileFixProps) => {
  const { active } = useMobileFix();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Mobile Layout Fix</h2>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
