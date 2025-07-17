import { IsString, IsNumber, IsOptional, MinLength, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Nome do produto deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(200, { message: 'Nome deve ter no máximo 200 caracteres' })
  name!: string;

  @IsString({ message: 'ID da empresa deve ser uma string' })
  companyId!: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @MinLength(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
  description!: string;

  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  price!: number;

  @IsOptional()
  @IsString({ message: 'ID da categoria deve ser uma string' })
  categoryId?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Nome do produto deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(200, { message: 'Nome deve ter no máximo 200 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  @MinLength(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
  @MaxLength(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço não pode ser negativo' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'ID da categoria deve ser uma string' })
  categoryId?: string;
} 