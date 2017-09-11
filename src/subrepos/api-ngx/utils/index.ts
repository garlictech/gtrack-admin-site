let typeCache: { [label: string]: boolean } = {};

export function type(label: string): string {
  if (typeCache[label] === true) {
    throw new Error(`Action type "${label}" is not unique"`);
  }

  typeCache[label] = true;

  return label;
}
