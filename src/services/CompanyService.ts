import { Company, ICompany } from '../models/Company';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/Company';
import { S3Service } from './S3Service';

export class CompanyService {
  private s3Service: S3Service;

  constructor() {
    this.s3Service = new S3Service();
  }

  async createCompany(companyData: CreateCompanyDto): Promise<ICompany> {
    try {
      const existingCompany = await Company.findOne({ cnpj: companyData.cnpj });
      if (existingCompany) {
        throw new Error('CNPJ já está em uso');
      }

      let processedData = { ...companyData };
      if (companyData.customizations) {
        processedData.customizations = await this.processCustomizations(
          companyData.customizations,
          companyData.cnpj 
        );
      }

      const company = new Company(processedData);
      await company.save();
      
      return company;
    } catch (error) {
      throw error;
    }
  }

  async updateCompany(id: string, companyData: UpdateCompanyDto): Promise<ICompany | null> {
    try {
      const currentCompany = await Company.findById(id);
      if (!currentCompany) {
        return null;
      }

      let processedData = { ...companyData };

      // Processar customizações se fornecidas
      if (companyData.customizations) {
        // Remover imagens antigas se novas forem fornecidas
        if (currentCompany.customizations) {
          if (currentCompany.customizations.logo) {
            await this.s3Service.deleteImage(currentCompany.customizations.logo);
          }
          if (currentCompany.customizations.homeBanners && currentCompany.customizations.homeBanners.length > 0) {
            await this.s3Service.deleteMultipleImages(currentCompany.customizations.homeBanners);
          }
        }

        processedData.customizations = await this.processCustomizations(
          companyData.customizations,
          id,
          currentCompany.customizations
        );
      }

      const company = await Company.findOneAndUpdate(
        { _id: id },
        processedData,
        { new: true, runValidators: true }
      );
      
      return company;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Processa customizações convertendo base64 para URLs do S3
   */
  private async processCustomizations(
    customizations: any,
    companyId: string,
    existingCustomizations?: any
  ): Promise<any> {
    const processed = {
      brandColors: customizations.brandColors || existingCustomizations?.brandColors || [],
      homeBanners: existingCustomizations?.homeBanners || [],
      logo: existingCustomizations?.logo
    };

    // Processar logo se fornecida
    if (customizations.logo) {
      try {
        const logoUrl = await this.s3Service.uploadImageFromBase64(
          customizations.logo,
          'logos',
          companyId
        );
        processed.logo = logoUrl;
      } catch (error) {
        throw new Error(`Erro ao fazer upload da logo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    // Processar banners se fornecidos
    if (customizations.homeBanners && Array.isArray(customizations.homeBanners)) {
      try {
        const bannerUrls = await this.s3Service.uploadMultipleImagesFromBase64(
          customizations.homeBanners,
          'banners',
          companyId
        );
        processed.homeBanners = bannerUrls;
      } catch (error) {
        throw new Error(`Erro ao fazer upload dos banners: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    return processed;
  }

  async deleteCompany(id: string): Promise<boolean> {
    try {
      const company = await Company.findById(id);
      if (company?.customizations) {
        if (company.customizations.logo) {
          await this.s3Service.deleteImage(company.customizations.logo);
        }
        if (company.customizations.homeBanners.length > 0) {
          await this.s3Service.deleteMultipleImages(company.customizations.homeBanners);
        }
      }

      const result = await Company.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getCompanyById(id: string): Promise<ICompany | null> {
    try {
      return await Company.findOne({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  async getAllCompanies(): Promise<ICompany[]> {
    try {
      return await Company.find();
    } catch (error) {
      throw error;
    }
  }

  async getCompaniesByUserId(userId: string): Promise<ICompany[]> {
    try {
      return await Company.find({ userId });
    } catch (error) {
      throw error;
    }
  }
} 