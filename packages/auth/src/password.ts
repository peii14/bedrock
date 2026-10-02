/** Argon2id password hashing with a versioned HMAC pepper. */

const ARGON2 = { algorithm: "argon2id", memoryCost: 19456, timeCost: 2 } as const;

export type PepperConfig = {
  peppers: Record<string, string>;
  current: string;
};

export type PasswordHasher = ReturnType<typeof createPasswordHasher>;

/**
 * Stored format is `<pepperVersion>$<argon2 PHC string>`. The salt lives inside
 * the PHC string; the pepper never touches the database.
 */
export const createPasswordHasher = ({ peppers, current }: PepperConfig) => {
  const pepper = (password: string, version: string) => {
    const key = peppers[version];
    if (!key) throw new Error(`Unknown pepper version: ${version}`);
    return new Bun.CryptoHasher("sha256", Buffer.from(key, "base64"))
      .update(password)
      .digest("hex");
  };

  const hash = async (password: string) =>
    `${current}$${await Bun.password.hash(pepper(password, current), ARGON2)}`;

  const verify = async (password: string, stored: string) => {
    const sep = stored.indexOf("$");
    if (sep <= 0) return false;
    const version = stored.slice(0, sep);
    if (!(version in peppers)) return false;
    return Bun.password.verify(pepper(password, version), stored.slice(sep + 1));
  };

  const needsRehash = (stored: string) => !stored.startsWith(`${current}$`);

  return { hash, verify, needsRehash };
};
