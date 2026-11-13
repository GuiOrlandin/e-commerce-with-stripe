import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { finalize } from 'rxjs';
import {
  ChatQuotaService,
  ChatReservation,
} from 'src/modules/chat/quota/chatQuotaService';
import { runWithUsageMeter } from 'src/modules/chat/quota/usageMeter';

/** Meters real LLM tokens for the request and settles them against the guard's reserve (also on error). */
@Injectable()
export class ChatUsageInterceptor implements NestInterceptor {
  constructor(private chatQuota: ChatQuotaService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const reservation = context
      .switchToHttp()
      .getRequest<{ chatReservation?: ChatReservation }>().chatReservation;

    // Nest binds the handler to the async context active when handle() is called.
    return runWithUsageMeter((meter) =>
      next.handle().pipe(
        finalize(() => {
          if (reservation)
            void this.chatQuota.settle(reservation, meter.tokens);
        }),
      ),
    );
  }
}
