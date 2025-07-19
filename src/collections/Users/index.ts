import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  // access: {
  //   admin: authenticated,
  //   create: authenticated,
  //   delete: authenticated,
  //   read: authenticated,
  //   update: authenticated,
  // },
  access: {
    admin: ({ req }) => req.user?.role === 'admin',
    create: () => true,
    read: ({ req }) => req.user?.role === 'admin' || req.user?.id === req.id,
    update: ({ req }) => req.user?.role === 'admin' || req.user?.id === req.id,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],
    },
  ],
  timestamps: true,
}
