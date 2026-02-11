interface ImageOptProps {
  className?: string;
  id?: string;
}

export const ImageOpt = ({ className }: ImageOptProps) => {
  return <div className={className}>Image Optimization</div>;
};
