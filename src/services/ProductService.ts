import { Product, IProduct } from '../models/Product';
import { CreateProductDto, UpdateProductDto } from '../dto/ProductDto';

export class ProductService {
  async createProduct(productData: CreateProductDto): Promise<IProduct> {
    try {
      const product = new Product(productData);
      await product.save();
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id: string, productData: UpdateProductDto): Promise<IProduct | null> {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        productData,
        { new: true, runValidators: true }
      );
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await Product.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string): Promise<IProduct | null> {
    try {
      return await Product.findById(id)
        .populate('companyId', 'name cnpj')
        .populate('categoryId', 'name');
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(): Promise<IProduct[]> {
    try {
      return await Product.find()
        .populate('companyId', 'name cnpj')
        .populate('categoryId', 'name');
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCompany(companyId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ companyId })
        .populate('companyId', 'name cnpj')
        .populate('categoryId', 'name');
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ categoryId })
        .populate('companyId', 'name cnpj')
        .populate('categoryId', 'name');
    } catch (error) {
      throw error;
    }
  }

  async searchProducts(query: string): Promise<IProduct[]> {
    try {
      return await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
        .populate('companyId', 'name cnpj')
        .populate('categoryId', 'name');
    } catch (error) {
      throw error;
    }
  }
} 