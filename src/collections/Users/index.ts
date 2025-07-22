import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import type { PayloadRequest, Access, AccessArgs } from 'payload';


const isAdminOrSelf: Access = (
  args: AccessArgs,
  id?: string,
  _data?: unknown,
  _context?: unknown
) => {
  const { req } = args;
  return req.user?.role === 'admin' || req.user?.id === id;
};


const isAdmin = ({ req }: { req: PayloadRequest }): boolean => {
  return req.user?.role === 'admin';
};

export const Users: CollectionConfig = {
  slug: 'users',

  access: {
    admin: isAdmin,
    create: authenticated,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
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
