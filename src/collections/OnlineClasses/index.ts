import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const OnlineClasses: CollectionConfig = {
  slug: 'online-classes',
  access: {
    // admin: authenticated,
    // create: authenticated,
    // delete: authenticated,
    // read: authenticated,
    // update: authenticated,
    read: () => true,
  },
  admin: {
    useAsTitle: 'classTitle',
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
      },
    },
    {
      name: 'classTitle',
      type: 'text',
      required: true,
    },
  ],
};

