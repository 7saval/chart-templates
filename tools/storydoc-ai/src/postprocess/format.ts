import prettier from 'prettier';

export async function formatTypeScript(code: string): Promise<string> {
  return prettier.format(code, { parser: 'typescript', singleQuote: true });
}
