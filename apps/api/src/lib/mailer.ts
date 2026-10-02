/** Email transport. Logs in development; swap in an SMTP or Resend adapter for production. */

import type { Logger } from "./logger";

export type Mail = { to: string; subject: string; text: string };
export type Mailer = (mail: Mail) => Promise<void>;

export const createConsoleMailer =
  (logger: Logger): Mailer =>
  async ({ to, subject, text }) => {
    logger.info("email", { to, subject, body: text });
  };
