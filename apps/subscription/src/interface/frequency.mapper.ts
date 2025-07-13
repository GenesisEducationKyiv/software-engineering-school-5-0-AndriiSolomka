import { Frequency as DomainFrequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { Frequency as ProtoFrequency } from 'libs/proto/generated/subscription';

const protoToDomainMap: Record<ProtoFrequency, DomainFrequency> = {
  [ProtoFrequency.hourly]: DomainFrequency.hourly,
  [ProtoFrequency.daily]: DomainFrequency.daily,
  [ProtoFrequency.UNRECOGNIZED]: DomainFrequency.hourly,
};

export function mapProtoToDomain(proto: ProtoFrequency): DomainFrequency {
  const mapped = protoToDomainMap[proto];
  if (!mapped) throw new Error(`Invalid proto frequency: ${proto}`);
  return mapped;
}
