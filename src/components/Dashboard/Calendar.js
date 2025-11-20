import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const NIGERIA_HOLIDAYS_CALENDAR_ID =
  process.env.REACT_APP_NIGERIA_HOLIDAYS_CALENDAR_ID;

const CalendarComponent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.MONTH);
  const [events, setEvents] = useState([]);
  const [nigeriaHolidays, setNigeriaHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const lastFetchedYear = useRef(null);

  // --- UPDATED: Generate a list of years for the dropdown in DESCENDING order ---
  // This creates an array: [2030, 2029, ... 2020]
  const currentSystemYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentSystemYear + 5 - i);

  const loadFallbackHolidays = useCallback((year) => {
    const fallbackHolidays = [
      { date: `${year}-01-01`, name: "New Year's Day" },
      { date: `${year}-03-29`, name: "Good Friday (Approx)" },
      { date: `${year}-04-01`, name: "Easter Monday (Approx)" },
      { date: `${year}-05-01`, name: "Workers' Day" },
      { date: `${year}-05-27`, name: "Children's Day" },
      { date: `${year}-06-12`, name: "Democracy Day" },
      { date: `${year}-06-16`, name: "Eid-el-Kabir (Approx)" },
      { date: `${year}-09-16`, name: "Eid-el-Mawlid (Approx)" },
      { date: `${year}-10-01`, name: "Independence Day" },
      { date: `${year}-12-25`, name: "Christmas Day" },
      { date: `${year}-12-26`, name: "Boxing Day" },
    ];

    const holidayEvents = fallbackHolidays.map((holiday) => ({
      id: holiday.date,
      title: holiday.name,
      start: new Date(holiday.date),
      end: new Date(holiday.date),
      allDay: true,
      isHoliday: true,
      isFallback: true,
    }));

    setEvents(holidayEvents);
    setNigeriaHolidays(holidayEvents);
  }, []);

  const fetchNigeriaHolidays = useCallback(async () => {
    const displayYear = currentDate.getFullYear();

    if (lastFetchedYear.current === displayYear && events.length > 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const timeMin = new Date(displayYear, 0, 1).toISOString();
      const timeMax = new Date(displayYear, 11, 31).toISOString();

      if (!API_KEY || !NIGERIA_HOLIDAYS_CALENDAR_ID) {
        throw new Error("Missing API Key or Calendar ID in .env file");
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
          NIGERIA_HOLIDAYS_CALENDAR_ID
        )}/events?` +
          `key=${API_KEY}&` +
          `timeMin=${timeMin}&` +
          `timeMax=${timeMax}&` +
          `singleEvents=true&` +
          `orderBy=startTime`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const holidayEvents = data.items.map((event) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.date || event.start.dateTime),
          end: new Date(event.end.date || event.end.dateTime),
          allDay: true,
          isHoliday: true,
          description: event.description,
          rawEvent: event,
        }));

        setEvents(holidayEvents);
        setNigeriaHolidays(holidayEvents);
        lastFetchedYear.current = displayYear;
        setError("");
      } else {
        throw new Error("No holiday data found");
      }
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setError(`Failed to load ${displayYear} holidays. Using fallback data.`);
      loadFallbackHolidays(displayYear);
    } finally {
      setLoading(false);
    }
  }, [currentDate, loadFallbackHolidays, events.length]);

  useEffect(() => {
    fetchNigeriaHolidays();
  }, [fetchNigeriaHolidays]);

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  // --- Handle Year Dropdown Change ---
  const handleYearChange = (event) => {
    const newYear = event.target.value;
    // Reset date to January 1st of the selected year
    const newDate = new Date(newYear, 0, 1);
    setCurrentDate(newDate);
    // Note: lastFetchedYear logic handles the refresh automatically
  };

  const handleSelectEvent = (event) => {
    alert(`${event.title}\n${moment(event.start).format("MMMM Do YYYY")}`);
  };

  const eventStyleGetter = (event) => {
    if (event.isHoliday) {
      return {
        style: {
          backgroundColor: event.isFallback ? "#ffa726" : "#ff6b6b",
          borderRadius: "4px",
          opacity: 0.9,
          color: "white",
          border: "0px",
          display: "block",
          fontWeight: "bold",
        },
      };
    }
    return {};
  };

  // --- Updated Logout Functions ---
  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    setLogoutDialogOpen(false);
    window.location.href = "/login";
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const forceRefresh = () => {
    lastFetchedYear.current = null;
    fetchNigeriaHolidays();
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            📅 Dashboard - Welcome, {currentUser.firstName}!
          </Typography>
          <Button
            color="inherit"
            onClick={forceRefresh}
            disabled={loading}
            sx={{ mr: 2 }}>
            🔄 Refresh
          </Button>
          <Button color="inherit" onClick={handleLogoutClick}>
            🚪 Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* --- UPDATED HEADER SECTION WITH YEAR SELECTOR --- */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
          }}>
          <Typography variant="h4" sx={{ color: "#1976d2" }}>
            🇳🇬 Nigeria Public Holidays
          </Typography>

          {/* Year Selector Dropdown */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="subtitle1">Jump to Year:</Typography>
            <FormControl
              size="small"
              sx={{ minWidth: 120, backgroundColor: "white" }}>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={currentDate.getFullYear()}
                label="Year"
                onChange={handleYearChange}>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={forceRefresh}>
                Retry
              </Button>
            }>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", lg: "row" },
          }}>
          {/* Calendar Section */}
          <Box sx={{ flex: 2, minHeight: 600 }}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}>
                  <Typography variant="h6">Calendar View</Typography>
                  {loading && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      <Typography variant="body2">Loading...</Typography>
                    </Box>
                  )}
                </Box>

                {currentView !== "month" && (
                  <Typography
                    variant="caption"
                    sx={{ mb: 1, display: "block", color: "text.secondary" }}>
                    Note: Holidays are "All Day" events and appear in the top
                    row of the grid.
                  </Typography>
                )}

                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  onSelectEvent={handleSelectEvent}
                  selectable
                  eventPropGetter={eventStyleGetter}
                  views={["month", "week", "day"]}
                  view={currentView}
                  onView={handleViewChange}
                  date={currentDate}
                  onNavigate={handleNavigate}
                  min={new Date(0, 0, 0, 8, 0, 0)}
                  popup
                />
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar Section */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📋 Holidays List ({currentDate.getFullYear()})
                </Typography>
                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <List dense sx={{ maxHeight: 600, overflow: "auto" }}>
                    {nigeriaHolidays
                      .sort((a, b) => new Date(a.start) - new Date(b.start))
                      .map((holiday, index) => (
                        <ListItem
                          key={holiday.id || index}
                          sx={{
                            borderLeft: holiday.isFallback
                              ? "4px solid #ffa726"
                              : "4px solid #ff6b6b",
                            mb: 0.5,
                          }}>
                          <ListItemText
                            primary={holiday.title}
                            secondary={moment(holiday.start).format(
                              "MMMM DD, YYYY"
                            )}
                          />
                        </ListItem>
                      ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description">
        <DialogTitle id="logout-dialog-title" sx={{ color: "#1976d2" }}>
          🚪 Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            <Typography variant="body1" gutterBottom>
              Are you sure you want to log out,{" "}
              <strong>{currentUser.firstName}</strong>?
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              You will need to log in again to access the calendar.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            color="primary"
            variant="contained"
            autoFocus>
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarComponent;