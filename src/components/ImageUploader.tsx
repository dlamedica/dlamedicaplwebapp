import React, { useState, useRef, useCallback } from 'react';
import { FaCloudUploadAlt, FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  darkMode?: boolean;
  disabled?: boolean;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
  width?: number;
  height?: number;
  placeholder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  darkMode = false,
  disabled = false,
  maxSize = 2,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg'],
  width = 200,
  height = 200,
  placeholder = "Przeciągnij logo tutaj lub kliknij aby wybrać"
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Nieobsługiwany format pliku. Dozwolone: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }

    // Check file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      return `Plik jest za duży. Maksymalny rozmiar: ${maxSize}MB`;
    }

    return null;
  };

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        let { width: imgWidth, height: imgHeight } = img;
        const aspectRatio = imgWidth / imgHeight;

        if (imgWidth > imgHeight) {
          imgWidth = width;
          imgHeight = width / aspectRatio;
        } else {
          imgHeight = height;
          imgWidth = height * aspectRatio;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Fill background with white (for transparency)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        // Calculate position to center the image
        const x = (width - imgWidth) / 2;
        const y = (height - imgHeight) / 2;

        // Draw the resized image
        ctx.drawImage(img, x, y, imgWidth, imgHeight);

        // Convert to blob and then to data URL
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);
    setIsLoading(true);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      // Resize and process image
      const resizedImageUrl = await resizeImage(file);
      setPreview(resizedImageUrl);
      onChange(resizedImageUrl);

    } catch (err) {
      setError('Wystąpił błąd podczas przetwarzania obrazu');
      console.error('Image processing error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onChange, maxSize, acceptedFormats, width, height]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const containerClasses = `
    relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
    ${isDragOver 
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
      : darkMode 
        ? 'border-gray-600 hover:border-gray-500' 
        : 'border-gray-300 hover:border-gray-400'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${error ? 'border-red-500' : ''}
  `;

  return (
    <div className="space-y-2">
      <div
        className={containerClasses}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        style={{ width: width + 40, height: height + 40 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <FaSpinner className="animate-spin text-3xl text-blue-500 mb-2" />
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Przetwarzanie...
            </p>
          </div>
        ) : preview ? (
          <div className="relative h-full p-2">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded"
            />
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Usuń obraz"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            )}
            <div className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-1">
              <FaCheck className="w-3 h-3" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <FaCloudUploadAlt 
              className={`text-4xl mb-3 ${
                isDragOver ? 'text-blue-500' : darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} 
            />
            <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {placeholder}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} • Max {maxSize}MB
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Obraz zostanie przeskalowany do {width}x{height}px
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-500 text-sm">
          <FaTimes className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {preview && !error && !isLoading && (
        <div className="flex items-center space-x-2 text-green-500 text-sm">
          <FaCheck className="w-4 h-4" />
          <span>Obraz został pomyślnie przesłany</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;