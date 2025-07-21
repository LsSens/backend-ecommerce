import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { Company } from '../models/Company';
import { Product } from '../models/Product';

async function migrateOrders() {
  try {
    // Conectar ao banco de dados
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
    }
    await mongoose.connect(mongoUri);
    console.log('Conectado ao MongoDB');

    // Verificar se já existem pedidos
    const existingOrders = await Order.countDocuments();
    if (existingOrders > 0) {
      console.log('Já existem pedidos no banco de dados. Pulando migração.');
      return;
    }

    console.log('Nenhum pedido encontrado. Criando dados de exemplo...');

    // Buscar usuário de exemplo (criar se não existir)
    let user = await User.findOne({ email: 'cliente@exemplo.com' });
    if (!user) {
      user = new User({
        name: 'João Silva',
        email: 'cliente@exemplo.com',
        password: '123456',
        phone: '(11) 99999-9999',
        address: 'Rua das Flores, 123 - Centro',
        role: 'Customer'
      });
      await user.save();
      console.log('Usuário de exemplo criado:', user._id);
    } else {
      console.log('Usuário de exemplo já existe:', user._id);
    }

    // Buscar empresa de exemplo (usar a existente ou criar uma nova)
    let company = await Company.findOne({ name: 'Loja Exemplo' });
    if (!company) {
      // Se não existir a Loja Exemplo, usar a empresa padrão existente
      company = await Company.findOne();
      if (!company) {
        company = new Company({
          name: 'Loja Exemplo',
          email: 'contato@lojaexemplo.com',
          phone: '(11) 88888-8888',
          address: 'Rua Comercial, 456 - Centro',
          cnpj: '98.765.432/0001-10' // CNPJ diferente para evitar conflito
        });
        await company.save();
        console.log('Empresa de exemplo criada:', company._id);
      } else {
        console.log('Usando empresa existente:', company._id);
      }
    } else {
      console.log('Empresa de exemplo já existe:', company._id);
    }

    // Buscar produtos de exemplo (criar se não existir)
    let product1 = await Product.findOne({ name: 'Smartphone Galaxy S21' });
    if (!product1) {
      product1 = new Product({
        name: 'Smartphone Galaxy S21',
        companyId: company._id,
        description: 'Smartphone Samsung Galaxy S21 com 128GB de armazenamento, tela de 6.2 polegadas e câmera tripla.',
        price: 2999.99,
        quantity: 50,
        images: ['https://exemplo.com/galaxy-s21-1.jpg', 'https://exemplo.com/galaxy-s21-2.jpg']
      });
      await product1.save();
      console.log('Produto 1 criado:', product1._id);
    } else {
      console.log('Produto 1 já existe:', product1._id);
    }

    let product2 = await Product.findOne({ name: 'Fone de Ouvido Bluetooth' });
    if (!product2) {
      product2 = new Product({
        name: 'Fone de Ouvido Bluetooth',
        companyId: company._id,
        description: 'Fone de ouvido sem fio com cancelamento de ruído e bateria de longa duração.',
        price: 299.99,
        quantity: 100,
        images: ['https://exemplo.com/fone-bluetooth-1.jpg']
      });
      await product2.save();
      console.log('Produto 2 criado:', product2._id);
    } else {
      console.log('Produto 2 já existe:', product2._id);
    }

    let product3 = await Product.findOne({ name: 'Capa para Smartphone' });
    if (!product3) {
      product3 = new Product({
        name: 'Capa para Smartphone',
        companyId: company._id,
        description: 'Capa protetora de silicone para smartphone, disponível em várias cores.',
        price: 49.99,
        quantity: 200,
        images: ['https://exemplo.com/capa-smartphone-1.jpg', 'https://exemplo.com/capa-smartphone-2.jpg']
      });
      await product3.save();
      console.log('Produto 3 criado:', product3._id);
    } else {
      console.log('Produto 3 já existe:', product3._id);
    }

    // Criar pedido de exemplo
    const orderData = {
      userId: user._id,
      companyId: company._id,
      items: [
        {
          productId: product1._id,
          productName: product1.name,
          quantity: 1,
          unitPrice: product1.price,
          totalPrice: product1.price,
          productImage: product1.images[0]
        },
        {
          productId: product2._id,
          productName: product2.name,
          quantity: 2,
          unitPrice: product2.price,
          totalPrice: product2.price * 2,
          productImage: product2.images[0]
        },
        {
          productId: product3._id,
          productName: product3.name,
          quantity: 1,
          unitPrice: product3.price,
          totalPrice: product3.price,
          productImage: product3.images[0]
        }
      ],
      subtotal: product1.price + (product2.price * 2) + product3.price,
      shippingCost: 15.00,
      discount: 50.00,
      total: (product1.price + (product2.price * 2) + product3.price) + 15.00 - 50.00,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      deliveryAddress: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      deliveryInstructions: 'Entregar no portão principal, tocar o interfone 45',
      notes: 'Cliente solicitou embalagem especial para presente',
      estimatedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 dias
    };

    const order = new Order(orderData);
    await order.save();

    console.log('Pedido de exemplo criado com sucesso!');
    console.log('Número do pedido:', order.orderNumber);
    console.log('ID do pedido:', order._id);
    console.log('Total do pedido: R$', order.total.toFixed(2));

    // Criar mais alguns pedidos com status diferentes
    const order2Data = {
      userId: user._id,
      companyId: company._id,
      items: [
        {
          productId: product1._id,
          productName: product1.name,
          quantity: 1,
          unitPrice: product1.price,
          totalPrice: product1.price,
          productImage: product1.images[0]
        }
      ],
      subtotal: product1.price,
      shippingCost: 0,
      discount: 0,
      total: product1.price,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'pix',
      deliveryAddress: {
        street: 'Avenida Paulista',
        number: '1000',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100'
      }
    };

    const order2 = new Order(order2Data);
    await order2.save();

    console.log('Segundo pedido criado (pendente):', order2.orderNumber);

    const order3Data = {
      userId: user._id,
      companyId: company._id,
      items: [
        {
          productId: product2._id,
          productName: product2.name,
          quantity: 1,
          unitPrice: product2.price,
          totalPrice: product2.price,
          productImage: product2.images[0]
        }
      ],
      subtotal: product2.price,
      shippingCost: 10.00,
      discount: 0,
      total: product2.price + 10.00,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'debit_card',
      deliveryAddress: {
        street: 'Rua Augusta',
        number: '500',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01305-000'
      },
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 dias
    };

    const order3 = new Order(order3Data);
    await order3.save();

    console.log('Terceiro pedido criado (enviado):', order3.orderNumber);

    console.log('\nMigração de pedidos concluída com sucesso!');
    console.log('Foram criados 3 pedidos de exemplo com diferentes status.');

  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
}

// Executar migração se o arquivo for executado diretamente
if (require.main === module) {
  migrateOrders();
}

export { migrateOrders }; 