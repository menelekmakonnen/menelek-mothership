const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

const seededValue = (input = '', seed = 0) => {
  const text = `${input}-${seed}`;
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0; // eslint-disable-line no-bitwise
  }
  return Math.abs(hash % 10000) / 10000;
};

export const SORT_OPTIONS = [
  { value: 'az', label: 'Name A–Z' },
  { value: 'za', label: 'Name Z–A' },
  { value: 'random', label: 'Random' },
];

export const sortCollectionByMode = (items = [], mode = 'az', seed = 0, accessor = (item) => item?.title || '') => {
  if (!Array.isArray(items)) return [];
  const clone = [...items];
  switch (mode) {
    case 'za':
      return clone.sort((a, b) => collator.compare(accessor(b) || '', accessor(a) || ''));
    case 'random':
      return clone.sort(
        (a, b) =>
          seededValue(`${accessor(a) || ''}-${a?.id || ''}`, seed) -
          seededValue(`${accessor(b) || ''}-${b?.id || ''}`, seed)
      );
    case 'az':
    default:
      return clone.sort((a, b) => collator.compare(accessor(a) || '', accessor(b) || ''));
  }
};
