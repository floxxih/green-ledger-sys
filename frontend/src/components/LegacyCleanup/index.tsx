interface LegacyCleanupProps {
  className?: string;
  id?: string;
}

export const LegacyCleanup = ({ className }: LegacyCleanupProps) => {
  return <div className={className}>Legacy API Cleanup</div>;
};
