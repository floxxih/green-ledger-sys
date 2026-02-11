interface MobileFixProps {
  className?: string;
  id?: string;
}

export const MobileFix = ({ className }: MobileFixProps) => {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Mobile Layout Fix</h2>
    </div>
  );
};
