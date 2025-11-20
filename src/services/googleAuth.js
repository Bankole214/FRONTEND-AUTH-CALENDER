const loadGapi = () => {
  return new Promise((resolve, reject) => {
    if (window.gapi) {
      resolve(window.gapi);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", () => {
        resolve(window.gapi);
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export const googleAuthService = {
  initClient: async (config) => {
    try {
      const gapi = await loadGapi();
      await gapi.client.init({
        apiKey: config.API_KEY,
        clientId: config.CLIENT_ID,
        discoveryDocs: config.DISCOVERY_DOCS,
        scope: config.SCOPES,
      });
      return gapi;
    } catch (error) {
      console.error("Error initializing Google API client:", error);
      throw error;
    }
  },

  signIn: async () => {
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();

      const profile = googleUser.getBasicProfile();
      const authResponse = googleUser.getAuthResponse();

      return {
        user: {
          id: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          imageUrl: profile.getImageUrl(),
        },
        token: authResponse.access_token,
        idToken: authResponse.id_token,
      };
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  },

  isSignedIn: () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    return auth2.isSignedIn.get();
  },

  getCurrentUser: () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
      const googleUser = auth2.currentUser.get();
      const profile = googleUser.getBasicProfile();

      return {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
      };
    }
    return null;
  },
};

export const calendarService = {
  getNigeriaHolidays: async (year = new Date().getFullYear()) => {
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: "en.nigerian#holiday@group.v.calendar.google.com",
        timeMin: new Date(year, 0, 1).toISOString(),
        timeMax: new Date(year, 11, 31).toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      });

      return response.result.items || [];
    } catch (error) {
      console.error("Error fetching Nigeria holidays:", error);
      return [];
    }
  },

  getUserCalendars: async () => {
    try {
      const response = await window.gapi.client.calendar.calendarList.list();
      return response.result.items || [];
    } catch (error) {
      console.error("Error fetching user calendars:", error);
      return [];
    }
  },
};
