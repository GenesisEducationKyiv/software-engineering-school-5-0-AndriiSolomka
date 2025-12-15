export const EMAIL_METRIC_NAMES = {
  SENT_TOTAL: 'email_sent_total',
  SEND_DURATION: 'email_send_duration_seconds',
  SEND_ERRORS_TOTAL: 'email_send_errors_total',
};

export enum EMAIL_SEND_STATUS {
  SUCCESS = 'success',
  ERROR = 'error',
}
