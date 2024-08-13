import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/repositories/userRepository';
import Stripe from 'stripe';

interface CheckOutItems {
  name: string;
  quantity: number;
  unitValue: number;
}

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

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    const user = await this.userRepository.findById(metadataUserId);

    if (!user) {
      throw new Error('User dont found!');
    }

    await this.userRepository.SaveCheckoutInUser(
      lineItems,
      user,
      session.customer_details?.address,
    );

    return 'Your payment was successful';
  }
}
