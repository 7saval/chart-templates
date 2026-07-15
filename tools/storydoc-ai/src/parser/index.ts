import { withCustomConfig } from 'react-docgen-typescript';
import type { ComponentDoc } from 'react-docgen-typescript';

export interface ParserOptions {
  tsconfigPath: string;
}

export function createParser({ tsconfigPath }: ParserOptions) {
  return withCustomConfig(tsconfigPath, {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    shouldExtractValuesFromUnion: true,
    shouldRemoveUndefinedFromOptional: true,
    propFilter: (prop) => {
      // Keep props declared anywhere in this repo's own src/ (this is what
      // lets ChartBaseProps' inherited fields — height/isLoading/error/theme —
      // survive on TrendLineChartProps). Drop anything resolved purely from
      // node_modules (e.g. inherited DOM/React attributes) so the dump stays
      // scoped to component-authored props.
      if (prop.declarations && prop.declarations.length > 0) {
        return !prop.declarations.every((d) => d.fileName.includes('node_modules'));
      }
      return true;
    },
  });
}

export type Parser = ReturnType<typeof createParser>;

export function parseComponent(parser: Parser, componentFile: string): ComponentDoc {
  const [doc] = parser.parse(componentFile);
  if (!doc) {
    throw new Error(`react-docgen-typescript extracted no component from: ${componentFile}`);
  }
  return doc;
}
