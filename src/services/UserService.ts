import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../dto/User';
import { Product } from '../models/Product';

interface CartProduct {
  productId: string;
  quantity: number;
  product?: any;
  itemTotal?: number;
}

interface CartWithProducts {
  products: CartProduct[];
}

export class UserService {
  async createUser(userData: CreateUserDto): Promise<IUser> {
    try {
      const { email, cpf, companyId } = userData;
      
      // Verificar se o email já existe na mesma empresa
      if (email) {
        const existingUserByEmail = await User.findOne({ 
          email: email,
          companyId: companyId 
        });
        if (existingUserByEmail) {
          throw new Error('Email já está em uso nesta empresa');
        }
      }

      // Verificar se o CPF já existe na mesma empresa (se CPF foi fornecido)
      if (cpf) {
        const existingUserByCpf = await User.findOne({ 
          cpf: cpf,
          companyId: companyId 
        });
        if (existingUserByCpf) {
          throw new Error('CPF já está em uso nesta empresa');
        }
      }

      const user = new User(userData);
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto, companyId: string): Promise<IUser | null> {
    try {
      const { email, cpf } = userData;
      
      // Verificar se o email já existe na mesma empresa (excluindo o usuário atual)
      if (email) {
        const existingUserByEmail = await User.findOne({ 
          email: email,
          companyId: companyId,
          _id: { $ne: id } // Excluir o usuário atual da verificação
        });
        if (existingUserByEmail) {
          throw new Error('Email já está em uso nesta empresa');
        }
      }

      // Verificar se o CPF já existe na mesma empresa (excluindo o usuário atual)
      if (cpf) {
        const existingUserByCpf = await User.findOne({ 
          cpf: cpf,
          companyId: companyId,
          _id: { $ne: id } // Excluir o usuário atual da verificação
        });
        if (existingUserByCpf) {
          throw new Error('CPF já está em uso nesta empresa');
        }
      }

      const user = await User.findOneAndUpdate(
        { _id: id, companyId },
        userData,
        { new: true, runValidators: true }
      );
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string, companyId: string): Promise<boolean> {
    try {
      const result = await User.findOneAndDelete({ _id: id, companyId });
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string, companyId: string): Promise<IUser | null> {
    try {
      return await User.findOne({ _id: id, companyId });
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(companyId: string): Promise<IUser[]> {
    try {
      return await User.find({ companyId }).select('-password');
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginDto, companyId: string): Promise<{ user: IUser; token: string }> {
    try {
      const user = await User.findOne({ email: loginData.email, companyId });
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      const isPasswordValid = await user.comparePassword(loginData.password);
      if (!isPasswordValid) {
        throw new Error('Email ou senha inválidos');
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('Erro de configuração do servidor');
      }

      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          name: user.name,
          companyId: user.companyId
        },
        jwtSecret,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
        } as any
      );

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async getUserCart(id: string, companyId: string): Promise<CartWithProducts | null> {
    try {
      const user = await User.findOne({ _id: id, companyId });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      
      if (!user.cart || !user.cart.products.length) {
        return { products: [] };
      }

      const productIds = user.cart.products.map(item => item.productId);
      const products = await Product.find({ 
        _id: { $in: productIds }, 
        companyId 
      }).select('name price description images');

      const cartWithProducts = {
        products: user.cart.products.map(cartItem => {
          const product = products.find(p => p._id.toString() === cartItem.productId);
          return {
            productId: cartItem.productId,
            ...(product ? {
              name: product.name,
              price: product.price,
              description: product.description,
              images: product.images
            } : null),
            quantity: cartItem.quantity
          };
        })
      };

      return cartWithProducts;
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(id: string, productId: string, quantity: number, companyId: string): Promise<IUser['cart'] | null> {
    try {
      const user = await User.findOne({ _id: id, companyId });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.cart) {
        user.cart = {
          products: []
        };
      }

      const product = await Product.findOne({ _id: productId, companyId });
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      if (quantity <= 0) {
        throw new Error('Quantidade inválida');
      }

      const cart = user.cart;
      const productIndex = cart.products.findIndex(p => p.productId === productId);
      
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
      user.markModified('cart');
      const savedUser = await User.findOneAndUpdate(
        { _id: id, companyId },
        { cart: cart },
        { new: true, runValidators: true }
      );
      return savedUser.cart;
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(id: string, productId: string, companyId: string): Promise<IUser['cart'] | null> {
    try {
      const user = await User.findOne({ _id: id, companyId });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.cart) {
        throw new Error('Carrinho de compras não encontrado');
      }

      const cart = user.cart;
      const productIndex = cart.products.findIndex(p => p.productId === productId);
      if (productIndex !== -1) {
        cart.products.splice(productIndex, 1);
      }

      const savedUser = await User.findOneAndUpdate(
        { _id: id, companyId },
        { cart: cart },
        { new: true, runValidators: true }
      );
      return savedUser.cart;
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantityInCart(id: string, productId: string, quantity: number, companyId: string): Promise<IUser['cart'] | null> {
    try {
      const user = await User.findOne({ _id: id, companyId });
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!user.cart) {
        throw new Error('Carrinho de compras não encontrado');
      }

      const product = await Product.findOne({ _id: productId, companyId });
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      if (quantity <= 0) {
        throw new Error('Quantidade inválida');
      }

      const cart = user.cart;
      const productIndex = cart.products.findIndex(p => p.productId === productId);
      
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
      } else {
        throw new Error('Produto não encontrado no carrinho');
      }

      const savedUser = await User.findOneAndUpdate(
        { _id: id, companyId },
        { cart: cart },
        { new: true, runValidators: true }
      );
      return savedUser.cart;
    } catch (error) {
      throw error;
    }
  }
} 