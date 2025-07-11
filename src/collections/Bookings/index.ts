import type { CollectionConfig } from 'payload';
import { sortOrder } from './hooks/sortOrder';
import { submitBooking } from './hooks/submitBooking';

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    create:()=> true
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'selectedDates',
      type: 'relationship',
      relationTo: 'online-classes',
      hasMany: true,
      required: true,
    },
    {
      name: 'paymentMethod',
      type: 'text',
      required: true
    },
  ],
  hooks: {
    afterChange: [submitBooking],
    // beforeChange: [sortOrder],
  },
};
