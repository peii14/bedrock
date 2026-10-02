/** Structured JSON logger that redacts credentials before anything is written. */

type Level = "debug" | "info" | "warn" | "error";
type Fields = Record<string, unknown>;

const SENSITIVE = /pass(word)?|secret|token|cookie|authorization|pepper/i;

const redact = (value: unknown, depth = 0): unknown => {
  if (depth > 4 || value === null || typeof value !== "object") return value;
  if (value instanceof Error)
    return { name: value.name, message: value.message, stack: value.stack };
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));
  return Object.fromEntries(
    Object.entries(value).map(([key, inner]) => [
      key,
      SENSITIVE.test(key) ? "[redacted]" : redact(inner, depth + 1),
    ]),
  );
};

const quiet = process.env.NODE_ENV === "test";

const write = (level: Level, message: string, fields: Fields = {}) => {
  if (quiet && (level === "debug" || level === "info")) return;
  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    message,
    ...(redact(fields) as Fields),
  });
  if (level === "error" || level === "warn") console.error(line);
  else console.log(line);
};

export const logger = {
  debug: (message: string, fields?: Fields) => write("debug", message, fields),
  info: (message: string, fields?: Fields) => write("info", message, fields),
  warn: (message: string, fields?: Fields) => write("warn", message, fields),
  error: (message: string, fields?: Fields) => write("error", message, fields),
};

export type Logger = typeof logger;
