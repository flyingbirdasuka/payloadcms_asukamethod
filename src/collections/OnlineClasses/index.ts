import type { CollectionConfig } from 'payload'
import { createMeeting } from './hooks/createMeeting';
import { anyone } from '@/access/anyone';
import { authenticated } from '@/access/authenticated';

export const OnlineClasses: CollectionConfig = {
  slug: 'online-classes',
  access: {
    read: anyone, // to be able to book from the website
    create: authenticated,
    update: authenticated,
    delete: ({ req }) => req.user?.role === 'admin'
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
    {
      name: 'teamsMeetingLink',
      type: 'text',
      label: 'Teams Meeting Link',
    }
  ],
  hooks: {
    afterChange: [createMeeting],
  },
};

