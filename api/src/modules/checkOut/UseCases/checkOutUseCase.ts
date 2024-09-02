import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/userRepository';
import Stripe from 'stripe';

interface CheckOutItems {
  name: string;
  description: string;
  quantity: number;
  unitValue: number;
  image_url: string;
  _id: string;
}

interface CheckOutRequest {
  items: CheckOutItems[];
  userId?: string;
}

@Injectable()
export class CheckOutUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ items, userId }: CheckOutRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado!');
    }

    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item) => ({
        price_data: {
          currency: 'BRL',
          product_data: {
            name: item.name,
            description: item.description,
            metadata: {
              image_url: item.image_url,
              product_id: item._id,
            },
          },
          unit_amount: item.unitValue * 100,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: ['BR'],
      },
      metadata: {
        userId: user.id,
      },
      mode: 'payment',
      success_url: `http://localhost:5173/success`,
      cancel_url: 'http://localhost:5173/',
    });

    return session.url;
  }
}
