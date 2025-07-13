import { IsString, IsOptional, MinLength, MaxLength, Matches, IsArray } from 'class-validator';

export class CreateCompanyDto {
  @IsString({ message: 'Nome da empresa deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(200, { message: 'Nome deve ter no máximo 200 caracteres' })
  name!: string;

  @IsString({ message: 'CNPJ deve ser uma string' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { 
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX' 
  })
  cnpj!: string;

  @IsString({ message: 'Endereço deve ser uma string' })
  address!: string;

  @IsArray({ message: 'Domínios devem ser um array' })
  @IsString({ each: true, message: 'Cada domínio deve ser uma string' })
  domains!: string[];

  @IsOptional()
  userId?: string;
}

export class UpdateCompanyDto {
  @IsOptional()
  @IsString({ message: 'Nome da empresa deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  @MaxLength(200, { message: 'Nome deve ter no máximo 200 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { 
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX' 
  })
  cnpj?: string;

  @IsOptional()
  @IsString({ message: 'Endereço deve ser uma string' })
  address?: string;

  @IsOptional()
  @IsArray({ message: 'Domínios devem ser um array' })
  @IsString({ each: true, message: 'Cada domínio deve ser uma string' })
  domains?: string[];

  @IsOptional()
  userId?: string;
} 