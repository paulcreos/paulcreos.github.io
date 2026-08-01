export const WORK_AVAILABILITY = {
  available: { label: 'Available', className: 'is-available' },
  sold: { label: 'Sold', className: 'is-sold' },
  'in-progress': { label: 'In progress', className: 'is-in-progress' },
} as const;

export type WorkAvailability = keyof typeof WORK_AVAILABILITY;
