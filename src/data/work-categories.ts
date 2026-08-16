export const WORK_CATEGORY_KEYS = ['roundels', 'icons', 'charms'] as const;

export type WorkCategory = (typeof WORK_CATEGORY_KEYS)[number];

export const WORK_CATEGORY_META: Record<
  WorkCategory,
  { label: string; title: string; description: string }
> = {
  charms: {
    label: 'Charms',
    title: 'Wood Charms',
    description: 'Personal symbols and gifts made from solid wood.',
  },
  roundels: {
    label: 'Roundels',
    title: 'Wood Roundels',
    description: 'Decorative and symbolic circular relief pictures made from solid wood.',
  },
  icons: {
    label: 'Icons',
    title: 'Wood Icons',
    description: 'Main figurative or narrative works made from solid wood.',
  },
};
