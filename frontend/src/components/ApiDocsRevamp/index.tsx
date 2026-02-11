interface ApiDocsRevampProps {
  className?: string;
  id?: string;
}

export const ApiDocsRevamp = ({ className }: ApiDocsRevampProps) => {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">API Docs Revamp</h2>
    </div>
  );
};
