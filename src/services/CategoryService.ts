import { Category, ICategory } from '../models/Category';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/CategoryDto';

export class CategoryService {
  async createCategory(categoryData: CreateCategoryDto): Promise<ICategory> {
    try {
      // Verificar se o nome da categoria já existe
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${categoryData.name}$`, 'i') } 
      });
      if (existingCategory) {
        throw new Error('Categoria já existe');
      }

      const category = new Category(categoryData);
      await category.save();
      
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<ICategory | null> {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        categoryData,
        { new: true, runValidators: true }
      );
      
      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await Category.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    try {
      return await Category.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAllCategories(): Promise<ICategory[]> {
    try {
      return await Category.find().sort({ name: 1 });
    } catch (error) {
      throw error;
    }
  }

  async searchCategories(query: string): Promise<ICategory[]> {
    try {
      return await Category.find({
        name: { $regex: query, $options: 'i' }
      }).sort({ name: 1 });
    } catch (error) {
      throw error;
    }
  }
} 