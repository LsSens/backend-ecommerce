import { Product, IProduct } from '../models/Product';
import { CreateProductDto, UpdateProductDto } from '../dto/Product';

export class ProductService {
  async createProduct(productData: CreateProductDto, companyId: string): Promise<IProduct> {
    try {
      const product = new Product({ ...productData, companyId });
      await product.save();
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id: string, productData: UpdateProductDto, companyId: string): Promise<IProduct | null> {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: id, companyId },
        productData,
        { new: true, runValidators: true }
      );
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: string, companyId: string): Promise<boolean> {
    try {
      const result = await Product.findOneAndDelete({ _id: id, companyId });
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string, companyId: string): Promise<IProduct | null> {
    try {
      return await Product.findOne({ _id: id, companyId })
        .populate('companyId', 'name cnpj')
        .populate('category', 'name');
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts(companyId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ companyId })
        .populate('companyId', 'name cnpj')
        .populate('category', 'name');
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCompany(companyId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ companyId })
        .populate('companyId', 'name cnpj')
        .populate('category', 'name');
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string, companyId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ category: categoryId, companyId })
        .populate('companyId', 'name cnpj')
        .populate('category', 'name');
    } catch (error) {
      throw error;
    }
  }

  async searchProducts(query: string, companyId: string): Promise<IProduct[]> {
    try {
      return await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ],
        companyId
      })
        .populate('companyId', 'name cnpj')
        .populate('category', 'name');
    } catch (error) {
      throw error;
    }
  }

  async getProductVariables(companyId: string): Promise<any[]> {
    try {
      const products = await Product.find({ companyId });
      
      const allVariables: any[] = [];
      products.forEach(product => {
        if (product.variables && Array.isArray(product.variables)) {
          allVariables.push(...product.variables.map(variable => ({
            ...JSON.parse(JSON.stringify(variable)),
            productId: product._id
          })));
        }
      });
      
      return allVariables;
    } catch (error) {
      throw error;
    }
  }
} 