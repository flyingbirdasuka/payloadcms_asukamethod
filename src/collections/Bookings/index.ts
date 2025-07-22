import type { CollectionConfig } from 'payload';
import { sortOrder } from './hooks/sortOrder';
import { submitBooking } from './hooks/submitBooking';
import { validateBooking } from './hooks/validateBooking';
import { anyone } from '@/access/anyone';
import { authenticated } from '@/access/authenticated';

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: anyone, // to be able to book from the website
    create: anyone, // to be able to book from the website
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin'
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
