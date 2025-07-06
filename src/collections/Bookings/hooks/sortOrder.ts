import type { CollectionBeforeChangeHook } from 'payload'


export const sortOrder: CollectionBeforeChangeHook = async ({ data, req }) => {
if (data.selectedDates?.length) {
    // Fetch classes to get dates
    const classes = await Promise.all(
    data.selectedDates.map((id: string | number) =>
        req.payload.findByID({ collection: 'online-classes', id }).catch(() => null)
    )
    );

    // Filter out any null values (failed fetches)
    const validClasses = classes.filter(Boolean);

    // Sort by date
    validClasses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Update selectedDates with sorted IDs
    data.selectedDates = validClasses.map((cls) => cls.id);
}

return data;
};