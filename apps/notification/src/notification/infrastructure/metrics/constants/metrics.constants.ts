export const NOTIFICATION_METRIC_NAMES = {
  EMAIL_PUBLISHED_TOTAL: 'notification_email_published_total',
  EMAIL_PUBLISH_DURATION: 'notification_email_publish_duration_seconds',
  EMAIL_PUBLISH_ERRORS_TOTAL: 'notification_email_publish_errors_total',
  OPERATION_DURATION: 'subscription_operation_duration_seconds',
};

export enum NOTIFICATION_EMAIL_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
}
