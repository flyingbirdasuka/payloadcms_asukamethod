import type { CollectionConfig } from 'payload'

export const OnlineClasses: CollectionConfig = {
  slug: 'online-classes',
  access: {
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

