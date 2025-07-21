import type { CollectionBeforeChangeHook } from 'payload'

export const validateBooking: CollectionBeforeChangeHook = async ({ data, req }) => {
  // Validate name (required + min length)
  if (!data.name || data.name.trim().length < 2) {
    throw new Error('Name must be at least 2 characters long.')
  }

  // Validate email format
  const emailRegex = /^[^@]+@[^@]+\.[^@]+$/
  if (!data.email || !emailRegex.test(data.email)) {
    throw new Error('Invalid email address.')
  }

  // Validate payment method
  const allowedMethods = ['stripe', 'paypal']
  if (!data.paymentMethod || !allowedMethods.includes(data.paymentMethod)) {
    throw new Error('Invalid payment method selected.')
  }

  // Validate selectedDates exist and are valid online-class IDs
  if (!Array.isArray(data.selectedDates) || data.selectedDates.length === 0) {
    throw new Error('Please select at least one class.')
  }

  // Fetch valid online-class IDs
  const allClasses = await req.payload.find({
    collection: 'online-classes',
    depth: 0,
    limit: 1000, // Adjust depending on your data size
  })

  const validClassIds = allClasses.docs.map(cls => cls.id)

  const invalidClassIds = data.selectedDates.filter((id: any) => !validClassIds.includes(id))
  if (invalidClassIds.length > 0) {
    throw new Error('One or more selected classes are invalid.')
  }

  // Optionally sanitize name/email
  data.name = data.name.trim()
  data.email = data.email.trim().toLowerCase()

  return data
}
