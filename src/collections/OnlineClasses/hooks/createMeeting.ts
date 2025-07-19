import type { CollectionAfterChangeHook } from 'payload'



const getAccessToken = async (): Promise<string> => {
    const tokenUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', `${process.env.AZURE_CLIENT_ID}`);
    params.append('client_secret', `${process.env.AZURE_CLIENT_SECRET}`);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('grant_type', 'client_credentials');

    const res = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
    
      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Failed to get access token: ${res.status} ${error}`);
      }
    
      const data = await res.json();
      return data.access_token;
};

export const createMeeting: CollectionAfterChangeHook = async ({ doc, req }) => {
    console.log('create meeting hook triggered', doc);
    if (doc.teamsMeetingLink) {
        console.log('Teams meeting link already exists. Skipping creation.');
        return;
    }

    //  Get the access token
    const accessToken = await getAccessToken();

    console.log('Access token received:', accessToken);

    //  Create a Teams Meeting
    const start = new Date(doc.date);
    const end = new Date(start.getTime() + 90 * 60 * 1000); // +1.5 hour

    const eventBody = {
        subject: doc.classTitle,
        start: {
          dateTime: start.toISOString(),
          timeZone: 'Europe/Amsterdam',
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: 'Europe/Amsterdam',
        },
        isOnlineMeeting: true,
        onlineMeetingProvider: "teamsForBusiness",
    };
    const eventRes = await fetch(
        `https://graph.microsoft.com/v1.0/users/${process.env.AZURE_USER_ID}/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventBody),
        }
      );
      
      if (!eventRes.ok) {
        const error = await eventRes.text();
        throw new Error(`Failed to create calendar event with Teams meeting: ${eventRes.status} ${error}`);
      }
      
      const eventData = await eventRes.json();
      const teamsMeetingLink = eventData.onlineMeeting?.joinUrl;
      
      console.log('Calendar event with Teams meeting created:', teamsMeetingLink);

      // Update the current doc with the meeting link field (e.g., 'teamsMeetingLink')
      await req.payload.update({
        collection: 'online-classes',
        id: doc.id,
        data: {
        teamsMeetingLink: teamsMeetingLink,
        },
        req,
    });
}