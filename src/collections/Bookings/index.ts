import type { CollectionConfig } from 'payload';
import { sortOrder } from './hooks/sortOrder';
import { submitBooking } from './hooks/submitBooking';
import { validateBooking } from './hooks/validateBooking';

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
    create:()=> true,
    update: ({ req }) => req.user?.role === 'admin',
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
    {
      name: 'status',
      type: 'text',
      required: true,
      defaultValue: 'pending',
    }
  ],
  hooks: {
    beforeChange: [validateBooking],
    afterChange: [submitBooking]
  },
};
