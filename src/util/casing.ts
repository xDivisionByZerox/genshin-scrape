export function kebabCase(input: string) {
  return input
    .toLowerCase()
    .replace(/^[^a-zA-Z\d]/, '')
    .replace(/[^a-zA-Z\d]$/, '')
    .replaceAll(/[\s']/g, '-');
}
