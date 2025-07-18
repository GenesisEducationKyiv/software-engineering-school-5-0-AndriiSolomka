export const KAFKA_CONSUMER = Symbol('KAFKA_CONSUMER');

export interface KafkaConsumer<T = unknown> {
  handleEvent(payload: T): Promise<void>;
}
