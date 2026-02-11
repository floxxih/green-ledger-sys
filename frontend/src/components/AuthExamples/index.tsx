interface AuthExamplesProps {
  className?: string;
  id?: string;
}

export const AuthExamples = ({ className }: AuthExamplesProps) => {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Auth Examples</h2>
    </div>
  );
};
