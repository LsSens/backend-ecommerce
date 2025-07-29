import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
    this.bucketName = process.env.S3_BUCKET_NAME || 'shophub-ecommerce-assets';
  }

  /**
   * Converte base64 para buffer e detecta extensão
   * @param base64String - String base64 com ou sem data URL
   * @returns Object com buffer e extensão
   */
  private parseBase64(base64String: string): { buffer: Buffer; extension: string } {
    let cleanBase64: string;
    let mimeType: string;

    // Verifica se é data URL (data:image/jpeg;base64,...)
    if (base64String.startsWith('data:')) {
      const [header, data] = base64String.split(',');
      cleanBase64 = data;
      mimeType = header.split(':')[1].split(';')[0];
    } else {
      cleanBase64 = base64String;
      mimeType = 'image/jpeg'; // Default
    }

    const buffer = Buffer.from(cleanBase64, 'base64');
    const extension = this.getExtensionFromMimeType(mimeType);

    return { buffer, extension };
  }

  /**
   * Converte MIME type para extensão
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp'
    };

    return mimeToExt[mimeType] || 'jpg';
  }

  /**
   * Faz upload de uma imagem base64 para o S3
   * @param base64String - String base64 da imagem
   * @param folder - Pasta no S3 (ex: 'logos', 'banners')
   * @param companyId - ID da empresa para organização
   * @returns URL pública da imagem
   */
  async uploadImageFromBase64(
    base64String: string,
    folder: string,
    companyId: string
  ): Promise<string> {
    try {
      const { buffer, extension } = this.parseBase64(base64String);
      const fileName = `${folder}/${companyId}/${uuidv4()}.${extension}`;
      
      // Validar tamanho (máximo 5MB)
      if (buffer.length > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 5MB');
      }

      const contentType = this.getContentType(extension);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: contentType
      });

      await this.s3Client.send(command);

      // Retorna URL pública direta
      return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new Error(`Erro ao fazer upload da imagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Faz upload de múltiplas imagens base64
   * @param base64Strings - Array de strings base64
   * @param folder - Pasta no S3
   * @param companyId - ID da empresa
   * @returns Array de URLs públicas
   */
  async uploadMultipleImagesFromBase64(
    base64Strings: string[],
    folder: string,
    companyId: string
  ): Promise<string[]> {
    try {
      const uploadPromises = base64Strings.map(base64 => 
        this.uploadImageFromBase64(base64, folder, companyId)
      );

      return await Promise.all(uploadPromises);
    } catch (error) {
      throw new Error(`Erro ao fazer upload das imagens: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Remove uma imagem do S3 usando URL
   * @param imageUrl - URL da imagem a ser removida
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extrair key da URL
      const key = imageUrl.replace(`https://${this.bucketName}.s3.amazonaws.com/`, '');
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('Erro ao deletar imagem do S3:', error);
      // Não lança erro para não quebrar o fluxo principal
    }
  }

  /**
   * Remove múltiplas imagens do S3
   * @param imageUrls - Array de URLs das imagens
   */
  async deleteMultipleImages(imageUrls: string[]): Promise<void> {
    try {
      const deletePromises = imageUrls.map(url => this.deleteImage(url));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Erro ao deletar imagens do S3:', error);
    }
  }

  private getContentType(extension: string): string {
    const contentTypes: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };

    return contentTypes[extension] || 'application/octet-stream';
  }
}