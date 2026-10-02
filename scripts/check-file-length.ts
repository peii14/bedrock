/** Fails when any source file exceeds the 350 line limit. */

const MAX_LINES = 350;
const glob = new Bun.Glob("{apps,packages,scripts}/**/*.{ts,tsx,js,css}");
const ignored = /(node_modules|\.next|dist|drizzle)\//;

const offenders: string[] = [];
for await (const path of glob.scan({ dot: false })) {
  if (ignored.test(path)) continue;
  const lines = (await Bun.file(path).text()).split("\n").length;
  if (lines > MAX_LINES) offenders.push(`${path}: ${lines} lines`);
}

if (offenders.length > 0) {
  console.error(`Files over ${MAX_LINES} lines:\n${offenders.join("\n")}`);
  process.exit(1);
}
