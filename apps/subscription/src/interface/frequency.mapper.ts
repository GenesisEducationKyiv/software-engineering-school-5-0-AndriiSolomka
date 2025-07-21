import { Frequency as DomainFrequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { Frequency as ProtoFrequency } from 'libs/proto/generated/subscription';

export function mapProtoToDomain(proto: ProtoFrequency): DomainFrequency {
  switch (proto) {
    case ProtoFrequency.hourly:
      return DomainFrequency.hourly;
    case ProtoFrequency.daily:
      return DomainFrequency.daily;
    default:
      throw new Error(`Invalid proto frequency: ${proto}`);
  }
}
