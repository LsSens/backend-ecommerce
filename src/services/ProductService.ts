import { Product, IProduct } from '../models/Product';
import { CreateProductDto, UpdateProductDto } from '../dto/Product';

interface ProductFilters {
  searchTerm?: string;
  categoryId?: string;
  includeVariables?: boolean;
}

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
      const product = await Product.findOne({ _id: id, companyId })
        .populate('companyId', 'name cnpj')
        .populate('category', 'name');
      
      // Adiciona categoryId para formulários de edição
      if (product && product.category) {
        (product as any).categoryId = product.category._id;
      }
      
      return product;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(companyId: string, filters: ProductFilters = {}): Promise<IProduct[] | any[]> {
    try {
      const { searchTerm, categoryId, includeVariables } = filters;

      // Se includeVariables for true, retorna apenas as variáveis
      if (includeVariables) {
        return await this.getProductVariables(companyId);
      }

      // Construir query de busca
      const query: any = { companyId };

      // Filtro por categoria
      if (categoryId) {
        query.category = categoryId;
      }

      // Filtro por termo de busca
      if (searchTerm) {
        query.$or = [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } }
        ];
      }

      const products = await Product.find(query)
        .populate('companyId', 'name cnpj')
        .populate('category', 'name');
      
      // Adiciona categoryId para cada produto
      products.forEach(product => {
        if (product.category) {
          (product as any).categoryId = product.category._id;
        }
      });
      
      return products;
    } catch (error) {
      throw error;
    }
  }

  private async getProductVariables(companyId: string): Promise<any[]> {
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