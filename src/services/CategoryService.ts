import { Category, ICategory } from '../models/Category';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/CategoryDto';

export class CategoryService {
    async createCategory(categoryData: CreateCategoryDto, companyId: string): Promise<ICategory> {
    try {
      // Verificar se o nome da categoria já existe na mesma empresa
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') },
        companyId
      });
      if (existingCategory) {
        throw new Error('Categoria já existe');
      }

      const category = new Category({ ...categoryData, companyId });
      await category.save();
      
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDto, companyId: string): Promise<ICategory | null> {
    try {
      const category = await Category.findOneAndUpdate(
        { _id: id, companyId },
        categoryData,
        { new: true, runValidators: true }
      );
      
      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string, companyId: string): Promise<boolean> {
    try {
      const result = await Category.findOneAndDelete({ _id: id, companyId });
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(id: string, companyId: string): Promise<ICategory | null> {
    try {
      return await Category.findOne({ _id: id, companyId });
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories(companyId: string): Promise<ICategory[]> {
    try {
      return await Category.find({ companyId }).sort({ name: 1 });
    } catch (error) {
      throw error;
    }
  }

  async searchCategories(query: string, companyId: string): Promise<ICategory[]> {
    try {
      return await Category.find({
        name: { $regex: query, $options: 'i' },
        companyId
      }).sort({ name: 1 });
    } catch (error) {
      throw error;
    }
  }
} 