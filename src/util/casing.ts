export function kebabCase(input: string) {
  return input
    .toLowerCase()
    .replaceAll(/[\s\']/g, '-');
}