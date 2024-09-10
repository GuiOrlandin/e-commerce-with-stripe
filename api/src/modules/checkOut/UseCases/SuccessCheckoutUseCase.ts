import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/userRepository';
import Stripe from 'stripe';

interface CheckOutRequest {
  userId?: string;
  sessionId: string;
}

@Injectable()
export class SuccessCheckOutUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ sessionId }: CheckOutRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [
        'line_items',
        'line_items.data.price.product',
        'customer_details',
      ],
    });

    const metadataUserId = session.metadata.userId;

    const user = await this.userRepository.findById(metadataUserId);

    if (!user) {
      throw new Error('User dont found!');
    }

    const processedItems = session.line_items?.data.map((item) => {
      const product = item.price?.product as Stripe.Product;
      return {
        amount_total: item.amount_total,
        description: product.description || '',
        purchase_id: item.id,
        name: product.name,
        quantity: item.quantity,
        unit_amount: item.price?.unit_amount || 0,
        image_url: product.metadata.image_url,
        product_id: product.metadata.product_id,
        status: 'paymentWasSuccessful',
      };
    });

    await this.userRepository.SaveCheckoutInUser(
      {
        data: processedItems,
      },
      user,
      session.customer_details?.address,
    );

    return 'Your payment was successful';
  }
}
