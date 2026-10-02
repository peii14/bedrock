/** Prints fresh secrets for .env. Never commit the output. */

const secret = () => Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64");

console.log(`BETTER_AUTH_SECRET=${secret()}`);
console.log(`PASSWORD_PEPPERS='${JSON.stringify({ v1: secret() })}'`);
console.log("PASSWORD_PEPPER_CURRENT=v1");
console.log(`POSTGRES_PASSWORD=${secret().replace(/[^a-zA-Z0-9]/g, "")}`);
