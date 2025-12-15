import { RpcException } from '@nestjs/microservices';
import { Frequency as DomainFrequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { Frequency as ProtoFrequency } from 'libs/proto/generated/subscription';

export function mapProtoToDomain(proto: ProtoFrequency): DomainFrequency {
  switch (proto) {
    case ProtoFrequency.hourly:
      return DomainFrequency.hourly;
    case ProtoFrequency.daily:
      return DomainFrequency.daily;
    case ProtoFrequency.UNRECOGNIZED:
      throw new RpcException(`Invalid proto frequency: UNRECOGNIZED`);
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const unknownFrequency: never = proto;
      throw new RpcException(`Invalid proto frequency: ${String(proto)}`);
    }
  }
}
