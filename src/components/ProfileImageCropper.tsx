import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FaCrop, FaUpload, FaTimes, FaCheck, FaInfoCircle } from 'react-icons/fa';

interface ProfileImageCropperProps {
  darkMode: boolean;
  onImageCropped: (croppedImageUrl: string) => void;
  onCancel: () => void;
  currentImage?: string;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

const ProfileImageCropper: React.FC<ProfileImageCropperProps> = ({ 
  darkMode, 
  onImageCropped, 
  onCancel,
  currentImage 
}) => {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setError('');
      const file = e.target.files[0];
      
      // Sprawdź rozmiar pliku (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Plik jest zbyt duży. Maksymalny rozmiar to 5MB.');
        return;
      }
      
      // Sprawdź typ pliku
      if (!file.type.startsWith('image/')) {
        setError('Plik musi być obrazem (JPG, PNG, GIF).');
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const imageUrl = reader.result?.toString() || '';
        setImgSrc(imageUrl);
      });
      reader.readAsDataURL(file);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  useCallback(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const rotateRads = rotate * (Math.PI / 180);
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();
  }, [completedCrop, scale, rotate]);

  const handleCropComplete = () => {
    if (!previewCanvasRef.current || !completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Ustaw rozmiar canvasu na 200x200 (rozmiar docelowy zdjęcia profilowego)
    canvas.width = 200;
    canvas.height = 200;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      200,
      200
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const croppedImageUrl = URL.createObjectURL(blob);
        onImageCropped(croppedImageUrl);
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Edytuj zdjęcie profilowe
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Wybierz zdjęcie i dostosuj kadr do swoich potrzeb
          </p>
        </div>

        <div className="p-6">
          {!imgSrc && (
            <div className="text-center">
              <div className={`mb-6 p-6 border-2 border-dashed rounded-lg ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <FaUpload className={`mx-auto text-4xl mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Przeciągnij zdjęcie tutaj lub kliknij, aby wybrać
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onSelectFile}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors"
                >
                  Wybierz zdjęcie
                </button>
              </div>

              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-blue-50'
              }`}>
                <div className="flex items-start">
                  <FaInfoCircle className={`mt-0.5 mr-2 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="font-semibold mb-2">Wskazówki dotyczące zdjęcia profilowego:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Użyj zdjęcia, na którym dobrze widać Twoją twarz</li>
                      <li>Wybierz zdjęcie o dobrej jakości (min. 200x200 pikseli)</li>
                      <li>Upewnij się, że zdjęcie jest profesjonalne i odpowiednie</li>
                      <li>Dozwolone formaty: JPG, PNG, GIF</li>
                      <li>Maksymalny rozmiar pliku: 5MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {currentImage && (
                <div className="mt-4">
                  <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Obecne zdjęcie:
                  </p>
                  <img
                    src={currentImage}
                    alt="Obecne zdjęcie profilowe"
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {imgSrc && (
            <div>
              <div className="mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                    onLoad={onImageLoad}
                    className="max-w-full"
                  />
                </ReactCrop>
              </div>

              <div className={`p-4 rounded-lg mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm font-medium mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Narzędzia edycji:
                </p>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-sm mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Zoom: {scale.toFixed(2)}x
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm mb-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Obrót: {rotate}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={rotate}
                      onChange={(e) => setRotate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => {
                    setImgSrc('');
                    setCrop(undefined);
                    setCompletedCrop(undefined);
                    setScale(1);
                    setRotate(0);
                    setError('');
                  }}
                  className={`px-4 py-2 rounded mr-2 ${
                    darkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors`}
                >
                  Wybierz inne zdjęcie
                </button>
              </div>

              {completedCrop && (
                <>
                  <canvas
                    ref={previewCanvasRef}
                    style={{
                      display: 'none',
                      objectFit: 'contain',
                      width: completedCrop.width,
                      height: completedCrop.height,
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>

        <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-end space-x-4`}>
          <button
            onClick={onCancel}
            className={`px-6 py-2 rounded flex items-center ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } transition-colors`}
          >
            <FaTimes className="mr-2" />
            Anuluj
          </button>
          {imgSrc && (
            <button
              onClick={handleCropComplete}
              className="px-6 py-2 bg-[#38b6ff] text-black rounded hover:bg-[#2a9fe5] transition-colors flex items-center"
            >
              <FaCheck className="mr-2" />
              Zapisz zdjęcie
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageCropper;