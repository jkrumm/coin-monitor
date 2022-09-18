import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

@Injectable()
export class RmqGuard implements CanActivate {
  canActivate(
    context: ExecutionContextHost,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (!isRabbitContext(context)) {
      return true;
    }
    const event = context.getArgs()[1].fields.routingKey;
    console.log(event);
    return true;
  }
}
