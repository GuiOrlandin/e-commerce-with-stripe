import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { finalize, tap } from 'rxjs';
import {
  ChatQuotaService,
  ChatReservation,
} from 'src/modules/chat/quota/chatQuotaService';
import { runWithUsageMeter } from 'src/modules/chat/quota/usageMeter';

/** Meters real LLM tokens for the request, settles them against the guard's reserve and logs one `chat_request` line (also on error). */
@Injectable()
export class ChatUsageInterceptor implements NestInterceptor {
  private readonly logger = new Logger('ChatRequest');

  constructor(private chatQuota: ChatQuotaService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<{
      user?: { id?: string };
      body?: { message?: unknown };
      chatReservation?: ChatReservation;
    }>();
    const reservation = request.chatReservation;
    const startedAt = Date.now();
    let error: string | undefined;

    // Nest binds the handler to the async context active when handle() is called.
    return runWithUsageMeter((meter) =>
      next.handle().pipe(
        tap({
          error: (e: unknown) =>
            (error = e instanceof Error ? e.constructor.name : 'UnknownError'),
        }),
        finalize(() => {
          if (reservation)
            void this.chatQuota.settle(reservation, meter.tokens);
          // Privacy: message/reply text never logged (PII, injection payloads); only its length.
          const message = request.body?.message;
          this.logger.log(
            JSON.stringify({
              event: 'chat_request',
              userId: request.user?.id,
              messageChars: typeof message === 'string' ? message.length : 0,
              latencyMs: Date.now() - startedAt,
              ...meter,
              status: error ? 'error' : 'ok',
              error,
            }),
          );
        }),
      ),
    );
  }
}
