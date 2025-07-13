import { Company, ICompany } from '../models/Company';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/CompanyDto';

export class CompanyService {
  async createCompany(companyData: CreateCompanyDto): Promise<ICompany> {
    try {
      const existingCompany = await Company.findOne({ cnpj: companyData.cnpj });
      if (existingCompany) {
        throw new Error('CNPJ já está em uso');
      }

      const company = new Company(companyData);
      await company.save();
      
      return company;
    } catch (error) {
      throw error;
    }
  }

  async updateCompany(id: string, companyData: UpdateCompanyDto): Promise<ICompany | null> {
    try {
      const company = await Company.findByIdAndUpdate(
        id,
        companyData,
        { new: true, runValidators: true }
      );
      
      return company;
    } catch (error) {
      throw error;
    }
  }

  async deleteCompany(id: string): Promise<boolean> {
    try {
      const result = await Company.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getCompanyById(id: string): Promise<ICompany | null> {
    try {
      return await Company.findById(id).populate('userId', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async getAllCompanies(): Promise<ICompany[]> {
    try {
      return await Company.find().populate('userId', 'name email');
    } catch (error) {
      throw error;
    }
  }

  async getCompaniesByUserId(userId: string): Promise<ICompany[]> {
    try {
      return await Company.find({ userId }).populate('userId', 'name email');
    } catch (error) {
      throw error;
    }
  }
} 