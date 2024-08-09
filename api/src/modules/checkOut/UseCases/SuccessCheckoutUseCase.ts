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

  async execute({ sessionId, userId }: CheckOutRequest) {
    if (!sessionId) {
      throw new Error('Session ID is required');
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado!');
    }

    await this.userRepository.SaveCheckoutInUser(lineItems, user);

    console.log(JSON.stringify(lineItems.data));

    return 'Your payment was successful';
  }
}
