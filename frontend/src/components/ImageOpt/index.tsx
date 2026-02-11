interface ImageOptProps {
  className?: string;
  id?: string;
}

export const ImageOpt = ({ className }: ImageOptProps) => {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <h2 className="text-xl font-bold">Image Optimization</h2>
    </div>
  );
};
