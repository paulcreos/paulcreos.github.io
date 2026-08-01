export const WORK_CATEGORY_KEYS = ['reliefs', 'icons', 'objects'] as const;

export type WorkCategory = (typeof WORK_CATEGORY_KEYS)[number];

export const WORK_CATEGORY_META: Record<
  WorkCategory,
  { label: string; title: string; description: string }
> = {
  reliefs: {
    label: 'Reliefs',
    title: 'Wood Reliefs',
    description: 'Circular and sculptural reliefs shaped in solid wood through carving, fire, and symbolic detail.',
  },
  icons: {
    label: 'Icons',
    title: 'Wood Icons',
    description: 'Larger iconographic works where image, symbol, and wood become a single presence.',
  },
  objects: {
    label: 'Objects',
    title: 'Objects',
    description: 'Other original works that follow their own form and purpose beyond relief and icon.',
  },
};
