import { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '@/access/anyone'

export const Tags: CollectionConfig = {
    slug: 'tags',
    access: {
      read: anyone,
      create: authenticated,
      update: authenticated,
      delete: authenticated,
    },
    admin: {
      useAsTitle: 'name',
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
      },
    ],
  }
  