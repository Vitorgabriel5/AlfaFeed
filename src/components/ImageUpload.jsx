import { useState, useRef } from 'react';
import { userService } from '../services';
import { showToast } from '../utils/toast';

function ImageUpload({ onImageUploaded }) {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      showToast.error('Por favor, selecione uma imagem');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    try {
      setIsUploading(true);
      const response = await userService.uploadProfilePicture(file);
      onImageUploaded(response.profilePicture);
      showToast.success('Imagem carregada!');
    } catch (error) {
      console.error(error);
      showToast.error('Erro ao fazer upload da imagem');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageUploaded(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      {preview ? (
        <div className="relative mt-3">
          <img 
            src={preview} 
            alt="Preview" 
            className="rounded-2xl max-h-64 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
          >
            ✕
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-full p-2 transition disabled:opacity-50"
            title="Adicionar imagem"
          >
            {isUploading ? (
              <span className="text-sm">Carregando...</span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;