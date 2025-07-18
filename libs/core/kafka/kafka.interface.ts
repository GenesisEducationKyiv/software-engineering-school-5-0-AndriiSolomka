export const KAFKA_CONSUMER = Symbol('KAFKA_CONSUMER');
export const KAFKA_PUBLISHER = Symbol('KAFKA_PUBLISHER');

export type KafkaConsumerHandler<T = unknown> = (data: T) => Promise<void>;
