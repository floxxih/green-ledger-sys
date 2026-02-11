interface LegacyCleanupProps {
  className?: string;
  id?: string;
}

export const LegacyCleanup = ({ className }: LegacyCleanupProps) => {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Legacy API Cleanup</h2>
    </div>
  );
};
