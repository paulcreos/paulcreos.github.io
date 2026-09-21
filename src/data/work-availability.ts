export const WORK_AVAILABILITY = {
  available: { label: 'Available on Etsy', className: 'is-available' },
  in_progress: { label: 'In progress', className: 'is-in-progress' },
  private: { label: 'Private collection', className: 'is-private' },
  sold: { label: 'Sold', className: 'is-sold' },
} as const;

export type WorkAvailability = keyof typeof WORK_AVAILABILITY;
