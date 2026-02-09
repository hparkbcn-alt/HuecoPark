import React, { ChangeEvent, FC, useState } from "react";
import Image from "next/image";
import { TbPhotoPlus } from "react-icons/tb";

interface ImageUploadProps {
  onChange: (fieldName: string, imgSrc: string) => void;
  initialImage?: string;
}

const ImageUpload: FC<ImageUploadProps> = ({ onChange, initialImage = "" }) => {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setError("");
    
    // Validar que sea una URL válida
    if (url && !url.startsWith("http")) {
      setError("Por favor ingresa una URL válida (debe empezar con http:// o https://)");
      return;
    }
    
    onChange("image", url);
  };

  return (
    <div className="space-y-4">
      <div className="relative border-dashed border-2 p-4 border-neutral-300 w-full h-[240px] flex flex-col justify-center items-center text-neutral-600">
        {imageUrl ? (
          <div className="absolute inset-0 w-full h-full">
            <Image
              fill
              style={{ objectFit: "cover" }}
              src={imageUrl}
              alt="parking"
              sizes="100vw"
              className="z-10"
              unoptimized
              onError={() => setError("Error al cargar la imagen. Verifica la URL.")}
            />
          </div>
        ) : (
          <>
            <TbPhotoPlus className="!w-[64px] !h-[64px] mb-4" />
            <span className="font-semibold text-lg">Vista previa de la imagen</span>
          </>
        )}
      </div>
      
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
          URL de la imagen del parking
        </label>
        <input
          type="url"
          id="imageUrl"
          value={imageUrl}
          onChange={handleChange}
          placeholder="https://images.unsplash.com/photo-..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Puedes buscar imágenes de parkings en{" "}
          <a 
            href="https://unsplash.com/s/photos/parking" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 underline"
          >
            Unsplash
          </a>
          {" "}y copiar la URL de la imagen.
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;
