import type { ComponentDoc } from 'react-docgen-typescript';

export interface ComponentPropMetadata {
  name: string;
  type: string | null;
  required: boolean;
  defaultValue: string | null;
  description: string;
}

export interface ComponentMetadata {
  component: string;
  sourceFile: string;
  description: string;
  props: ComponentPropMetadata[];
}

export function toComponentMetadata(doc: ComponentDoc, sourceFile: string): ComponentMetadata {
  return {
    component: doc.displayName,
    sourceFile,
    description: doc.description,
    props: Object.values(doc.props ?? {}).map((prop) => ({
      name: prop.name,
      // `type.name` collapses to "enum" for any union (including plain
      // `boolean`, which TS represents internally as `true | false`) once
      // shouldExtractValuesFromUnion is on — `type.raw` keeps the original,
      // human-readable type text instead.
      type: prop.type?.raw ?? prop.type?.name ?? null,
      required: prop.required,
      defaultValue: prop.defaultValue?.value ?? null,
      description: prop.description,
    })),
  };
}
