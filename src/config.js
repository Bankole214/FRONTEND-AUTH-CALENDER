export const GOOGLE_CONFIG = {
  CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
  SCOPES: [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events.readonly",
    "profile",
    "email",
  ].join(" "),
  DISCOVERY_DOCS: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

export const NIGERIA_HOLIDAYS_CALENDAR =
  "en.nigerian#holiday@group.v.calendar.google.com";
