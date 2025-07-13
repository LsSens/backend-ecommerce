import { User, IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { CreateUserDto, UpdateUserDto, LoginDto } from '../dto/UserDto';

export class UserService {
  async createUser(userData: CreateUserDto): Promise<IUser> {
    try {
      // Verificar se o email já existe
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      const user = new User(userData);
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<IUser | null> {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        userData,
        { new: true, runValidators: true }
      );
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find().select('-password');
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginDto): Promise<{ user: IUser; token: string }> {
    try {
      const user = await User.findOne({ email: loginData.email });
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
          name: user.name 
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
} 