import type { CollectionAfterChangeHook } from 'payload'


export const submitBooking: CollectionAfterChangeHook = async ({ doc, req }) => {
  console.log('submitBooking hook triggered');
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

      const res = await fetch('https://automation.asukamethod.com/webhook-test/b6ca52ca-b61c-4155-9714-f9977a576c0d', {
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