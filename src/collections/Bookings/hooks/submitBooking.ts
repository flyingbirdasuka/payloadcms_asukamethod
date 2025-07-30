import type { CollectionAfterChangeHook } from 'payload'


export const submitBooking: CollectionAfterChangeHook = async ({ doc, req, operation, previousDoc }) => {
  console.log('submitBooking hook triggered');
    // Only run on create
  if (operation !== 'create') {
    console.log('Skipping webhook: Not a creation');
    return;
  }
  try {
    if (!doc.selectedDates?.length) return;

    const fullClasses = await Promise.all(
      doc.selectedDates
        .map((entry: any) => (typeof entry === 'object' && entry.id ? entry.id : entry))
        .map((id: string | number) =>
          req.payload.findByID({ collection: 'online-classes', id })
        )
    )
    const filteredClasses = fullClasses.filter(Boolean);

    const webhookPayload = {
      ...doc,
      selectedDates: filteredClasses,
    };
    const res = await fetch(`${process.env.WEBHOOK_AUTOMATION_PAYMENT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });

    if (!res.ok) {
      console.error(`n8n webhook error: ${res.status} ${res.statusText}`);
    } else {
      console.log('Webhook sent successfully');
    }
  } catch (err) {
    console.error('Error in afterChange hook:', err);
  }
}