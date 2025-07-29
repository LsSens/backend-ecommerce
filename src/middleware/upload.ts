import multer from 'multer';
import { Request } from 'express';

// Configuração do multer para armazenar arquivos em memória
const storage = multer.memoryStorage();

// Filtro para aceitar apenas imagens
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Verificar tipo de arquivo por MIME type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
    files: 11 // Máximo 11 arquivos (1 logo + 10 banners)
  }
});

// Middleware específico para upload de customizações da empresa
export const uploadCompanyAssets = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'homeBanners', maxCount: 10 }
]);

// Middleware para tratar erros de upload
export const handleUploadErrors = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'Arquivo muito grande. Máximo 5MB por arquivo.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Muitos arquivos. Máximo 1 logo e 10 banners.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Campo de arquivo inesperado. Use "logo" ou "homeBanners".'
        });
      default:
        return res.status(400).json({
          success: false,
          message: `Erro no upload: ${error.message}`
        });
    }
  }

  if (error.message === 'Apenas arquivos de imagem são permitidos') {
    return res.status(400).json({
      success: false,
      message: 'Apenas arquivos de imagem são permitidos (jpg, jpeg, png, gif, webp)'
    });
  }

  next(error);
};