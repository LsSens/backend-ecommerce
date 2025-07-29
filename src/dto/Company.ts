import { IsString, IsOptional, MinLength, MaxLength, Matches, IsArray, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CompanyCustomizationsDto {
  @IsOptional()
  @IsArray({ message: 'Banners da home devem ser um array' })
  @IsString({ each: true, message: 'Cada banner deve ser uma string base64' })
  @ArrayMaxSize(10, { message: 'Máximo de 10 banners permitidos' })
  homeBanners?: string[];

  @IsOptional()
  @IsArray({ message: 'Cores da marca devem ser um array' })
  @IsString({ each: true, message: 'Cada cor deve ser uma string' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { each: true, message: 'Cores devem estar no formato hexadecimal (#FFFFFF ou #FFF)' })
  @ArrayMaxSize(5, { message: 'Máximo de 5 cores permitidas' })
  brandColors?: string[];

  @IsOptional()
  @IsString({ message: 'Logo deve ser uma string base64' })
  logo?: string;
}

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
  @ValidateNested()
  @Type(() => CompanyCustomizationsDto)
  customizations?: CompanyCustomizationsDto;
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
  @ValidateNested()
  @Type(() => CompanyCustomizationsDto)
  customizations?: CompanyCustomizationsDto;
} 