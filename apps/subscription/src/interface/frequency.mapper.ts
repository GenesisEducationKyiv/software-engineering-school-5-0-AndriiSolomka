import { Frequency as DomainFrequency } from 'apps/subscription/src/core/entities/subscription.entity';
import { Frequency as ProtoFrequency } from 'libs/proto/generated/subscription';

const protoToDomainMap: Record<ProtoFrequency, DomainFrequency> = {
  [ProtoFrequency.hourly]: DomainFrequency.hourly,
  [ProtoFrequency.daily]: DomainFrequency.daily,
  [ProtoFrequency.UNRECOGNIZED]: DomainFrequency.hourly,
};

const domainToProtoMap: Record<DomainFrequency, ProtoFrequency> = {
  [DomainFrequency.hourly]: ProtoFrequency.hourly,
  [DomainFrequency.daily]: ProtoFrequency.daily,
};

export function mapProtoToDomain(proto: ProtoFrequency): DomainFrequency {
  const mapped = protoToDomainMap[proto];
  if (!mapped) throw new Error(`Invalid proto frequency: ${proto}`);
  return mapped;
}

export function mapDomainToProto(domain: DomainFrequency): ProtoFrequency {
  const mapped = domainToProtoMap[domain];
  if (!mapped) throw new Error(`Invalid domain frequency: ${domain}`);
  return mapped;
}
