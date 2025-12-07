import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(value || '');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onChange(url);
  };

  const handleRemove = () => {
    setImageUrl('');
    onChange('');
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Cole a URL da imagem aqui..."
          value={imageUrl}
          onChange={handleUrlChange}
        />
        {imageUrl && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Image Preview */}
      {imageUrl && (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Erro+ao+carregar+imagem';
            }}
          />
        </div>
      )}

      {/* Upload Placeholder */}
      {!imageUrl && (
        <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg bg-gray-50">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Cole a URL da imagem acima</p>
        </div>
      )}
    </div>
  );
}
