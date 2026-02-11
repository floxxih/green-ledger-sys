import { useImageOpt } from '../../hooks/useImageOpt';

interface ImageOptProps {
  className?: string;
  id?: string;
}

export default function ImageOpt = ({ className }: ImageOptProps) => {
  const { active } = useImageOpt();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Image Optimization</h2>
      <p>Status: {active ? 'Active' : 'Inactive'}</p>
    </div>
  );
};
