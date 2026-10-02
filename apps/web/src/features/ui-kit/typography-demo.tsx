import { Typography, type TypographyVariant } from "@/components/ui/typography";

const SAMPLES: [TypographyVariant, string][] = [
  ["j1", "Display j1"],
  ["j2", "Display j2"],
  ["h1", "Heading h1"],
  ["h2", "Heading h2"],
  ["h3", "Heading h3"],
  ["s1", "Subtitle s1"],
  ["s2", "Subtitle s2"],
  ["b1", "Body b1, for lead paragraphs"],
  ["b2", "Body b2, the default for running text"],
  ["b3", "Body b3, for dense UI"],
  ["c1", "Caption c1"],
  ["c2", "Caption c2"],
];

export const TypographyDemo = () => (
  <div className="flex flex-col divide-y divide-separator">
    {SAMPLES.map(([variant, text]) => (
      <div key={variant} className="flex items-baseline gap-6 py-2.5">
        <code className="w-8 shrink-0 text-xs text-muted">{variant}</code>
        <Typography variant={variant} className="min-w-0 truncate">
          {text}
        </Typography>
      </div>
    ))}
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 pt-4">
      <Typography variant="j2" font="secondary">
        Secondary font
      </Typography>
      <Typography variant="b3" color="secondary">
        secondary
      </Typography>
      <Typography variant="b3" color="tertiary">
        tertiary
      </Typography>
      <Typography variant="b3" color="theme">
        theme
      </Typography>
      <Typography variant="b3" color="danger">
        danger
      </Typography>
    </div>
  </div>
);
