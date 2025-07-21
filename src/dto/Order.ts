import { IsString, IsNumber, IsOptional, MinLength, MaxLength, Min, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsString({ message: 'ID do produto deve ser uma string' })
  productId!: string;

  @IsString({ message: 'Nome do produto deve ser uma string' })
  @MinLength(2, { message: 'Nome do produto deve ter pelo menos 2 caracteres' })
  @MaxLength(200, { message: 'Nome do produto deve ter no máximo 200 caracteres' })
  productName!: string;

  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(1, { message: 'Quantidade deve ser pelo menos 1' })
  quantity!: number;

  @IsNumber({}, { message: 'Preço unitário deve ser um número' })
  @Min(0, { message: 'Preço unitário não pode ser negativo' })
  unitPrice!: number;

  @IsNumber({}, { message: 'Preço total deve ser um número' })
  @Min(0, { message: 'Preço total não pode ser negativo' })
  totalPrice!: number;

  @IsOptional()
  @IsString({ message: 'Imagem do produto deve ser uma string' })
  productImage?: string;
}

export class DeliveryAddressDto {
  @IsString({ message: 'Rua deve ser uma string' })
  @MinLength(3, { message: 'Rua deve ter pelo menos 3 caracteres' })
  @MaxLength(200, { message: 'Rua deve ter no máximo 200 caracteres' })
  street!: string;

  @IsString({ message: 'Número deve ser uma string' })
  @MinLength(1, { message: 'Número deve ter pelo menos 1 caractere' })
  @MaxLength(10, { message: 'Número deve ter no máximo 10 caracteres' })
  number!: string;

  @IsOptional()
  @IsString({ message: 'Complemento deve ser uma string' })
  @MaxLength(100, { message: 'Complemento deve ter no máximo 100 caracteres' })
  complement?: string;

  @IsString({ message: 'Bairro deve ser uma string' })
  @MinLength(2, { message: 'Bairro deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Bairro deve ter no máximo 100 caracteres' })
  neighborhood!: string;

  @IsString({ message: 'Cidade deve ser uma string' })
  @MinLength(2, { message: 'Cidade deve ter pelo menos 2 caracteres' })
  @MaxLength(100, { message: 'Cidade deve ter no máximo 100 caracteres' })
  city!: string;

  @IsString({ message: 'Estado deve ser uma string' })
  @MinLength(2, { message: 'Estado deve ter pelo menos 2 caracteres' })
  @MaxLength(50, { message: 'Estado deve ter no máximo 50 caracteres' })
  state!: string;

  @IsString({ message: 'CEP deve ser uma string' })
  @MinLength(8, { message: 'CEP deve ter pelo menos 8 caracteres' })
  @MaxLength(10, { message: 'CEP deve ter no máximo 10 caracteres' })
  zipCode!: string;
}

export class CreateOrderDto {
  @IsString({ message: 'ID do usuário deve ser uma string' })
  userId!: string;

  @IsString({ message: 'ID da empresa deve ser uma string' })
  companyId!: string;

  @IsArray({ message: 'Itens deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsNumber({}, { message: 'Subtotal deve ser um número' })
  @Min(0, { message: 'Subtotal não pode ser negativo' })
  subtotal!: number;

  @IsOptional()
  @IsNumber({}, { message: 'Custo de envio deve ser um número' })
  @Min(0, { message: 'Custo de envio não pode ser negativo' })
  shippingCost?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Desconto deve ser um número' })
  @Min(0, { message: 'Desconto não pode ser negativo' })
  discount?: number;

  @IsNumber({}, { message: 'Total deve ser um número' })
  @Min(0, { message: 'Total não pode ser negativo' })
  total!: number;

  @IsEnum(['credit_card', 'debit_card', 'pix', 'bank_transfer', 'cash'], {
    message: 'Método de pagamento deve ser credit_card, debit_card, pix, bank_transfer ou cash'
  })
  paymentMethod!: 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'cash';

  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress!: DeliveryAddressDto;

  @IsOptional()
  @IsString({ message: 'Instruções de entrega deve ser uma string' })
  @MaxLength(500, { message: 'Instruções de entrega deve ter no máximo 500 caracteres' })
  deliveryInstructions?: string;

  @IsOptional()
  @IsString({ message: 'Observações deve ser uma string' })
  @MaxLength(500, { message: 'Observações deve ter no máximo 500 caracteres' })
  notes?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'], {
    message: 'Status deve ser pending, confirmed, preparing, shipped, delivered ou cancelled'
  })
  status?: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

  @IsOptional()
  @IsEnum(['pending', 'paid', 'failed', 'refunded'], {
    message: 'Status do pagamento deve ser pending, paid, failed ou refunded'
  })
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';

  @IsOptional()
  @IsNumber({}, { message: 'Custo de envio deve ser um número' })
  @Min(0, { message: 'Custo de envio não pode ser negativo' })
  shippingCost?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Desconto deve ser um número' })
  @Min(0, { message: 'Desconto não pode ser negativo' })
  discount?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total deve ser um número' })
  @Min(0, { message: 'Total não pode ser negativo' })
  total?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress?: DeliveryAddressDto;

  @IsOptional()
  @IsString({ message: 'Instruções de entrega deve ser uma string' })
  @MaxLength(500, { message: 'Instruções de entrega deve ter no máximo 500 caracteres' })
  deliveryInstructions?: string;

  @IsOptional()
  @IsString({ message: 'Observações deve ser uma string' })
  @MaxLength(500, { message: 'Observações deve ter no máximo 500 caracteres' })
  notes?: string;

  @IsOptional()
  estimatedDeliveryDate?: Date;

  @IsOptional()
  actualDeliveryDate?: Date;
} 