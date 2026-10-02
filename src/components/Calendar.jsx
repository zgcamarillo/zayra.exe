import { useState } from "react";

function Calendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(today);

  const [showEventForm, setShowEventForm] = useState(false);

  const [eventName, setEventName] = useState("");

  const [editingEventId, setEditingEventId] = useState(null);

  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("zayra-events");

    return savedEvents ? JSON.parse(savedEvents) : {};
  });

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getDateKey = (date) => {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );

    setSelectedDate(today);
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate &&
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(year, month, day));
  };

  const openEventForm = () => {
    setEventName("");
    setEditingEventId(null);
    setShowEventForm(true);
  };

  const openEditForm = (eventToEdit) => {
    setEventName(eventToEdit.name);
    setEditingEventId(eventToEdit.id);
    setShowEventForm(true);
  };

  const closeEventForm = () => {
    setEventName("");
    setEditingEventId(null);
    setShowEventForm(false);
  };

  const handleSaveEvent = (event) => {
    event.preventDefault();

    if (!eventName.trim()) {
      return;
    }

    const dateKey = getDateKey(selectedDate);

    let updatedEvents;

    if (editingEventId !== null) {
      updatedEvents = {
        ...events,
        [dateKey]: (events[dateKey] || []).map((eventItem) =>
          eventItem.id === editingEventId
            ? {
                ...eventItem,
                name: eventName.trim(),
              }
            : eventItem
        ),
      };
    } else {
      const newEvent = {
        id: Date.now(),
        name: eventName.trim(),
      };

      updatedEvents = {
        ...events,
        [dateKey]: [
          ...(events[dateKey] || []),
          newEvent,
        ],
      };
    }

    setEvents(updatedEvents);

    localStorage.setItem(
      "zayra-events",
      JSON.stringify(updatedEvents)
    );

    closeEventForm();
  };

  const handleDeleteEvent = (eventId) => {
    const dateKey = getDateKey(selectedDate);

    const updatedDayEvents = (
      events[dateKey] || []
    ).filter((event) => event.id !== eventId);

    const updatedEvents = {
      ...events,
    };

    if (updatedDayEvents.length === 0) {
      delete updatedEvents[dateKey];
    } else {
      updatedEvents[dateKey] = updatedDayEvents;
    }

    setEvents(updatedEvents);

    localStorage.setItem(
      "zayra-events",
      JSON.stringify(updatedEvents)
    );
  };

  const selectedDateKey = getDateKey(selectedDate);

  const selectedEvents = events[selectedDateKey] || [];

  const selectedDateText = selectedDate.toLocaleDateString(
    "default",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <section className="calendar-page">
      <div className="calendar-header">
        <div>
          <p className="eyebrow">
            ♡ YOUR SCHEDULE
          </p>

          <h2>
            {monthName} {year}
          </h2>

          <p className="calendar-subtitle">
            cute calendar, serious business
          </p>
        </div>

        <div className="calendar-controls">
          <button
            className="calendar-control"
            onClick={previousMonth}
          >
            ←
          </button>

          <button
            className="today-button"
            onClick={goToToday}
          >
            Today
          </button>

          <button
            className="calendar-control"
            onClick={nextMonth}
          >
            →
          </button>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="dashboard-card full-calendar">
          <div className="calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="calendar-grid">
            {Array.from(
              { length: firstDayOfMonth },
              (_, index) => (
                <div
                  className="calendar-empty"
                  key={`empty-${index}`}
                />
              )
            )}

            {Array.from(
              { length: daysInMonth },
              (_, index) => {
                const day = index + 1;

                const dateForDay = new Date(
                  year,
                  month,
                  day
                );

                const dateKey =
                  getDateKey(dateForDay);

                const dayEvents =
                  events[dateKey] || [];

                return (
                  <button
                    key={day}
                    className={`calendar-date ${
                      isToday(day) ? "today" : ""
                    } ${
                      isSelected(day) ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleDateClick(day)
                    }
                  >
                    <span className="date-number">
                      {day}
                    </span>

                    {isToday(day) && (
                      <span className="today-label">
                        today
                      </span>
                    )}

                    {dayEvents.length > 0 && (
                      <span className="event-dot">
                        {dayEvents.length === 1
                          ? "♡"
                          : `${dayEvents.length} ♡`}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <aside className="calendar-details dashboard-card">
          <p className="card-label">
            SELECTED DATE
          </p>

          <h3>
            {selectedDateText}
          </h3>

          {selectedEvents.length === 0 ? (
            <div className="event-placeholder">
              <span className="event-icon">
                ♡
              </span>

              <p>
                Nothing planned yet.
              </p>

              <small>
                Add something to your day ✨
              </small>
            </div>
          ) : (
            <div className="events-list">
              {selectedEvents.map((event) => (
                <div
                  className="calendar-event"
                  key={event.id}
                >
                  <div className="calendar-event-info">
                    <span className="event-bullet">
                      ♡
                    </span>

                    <span>
                      {event.name}
                    </span>
                  </div>

                  <div className="event-actions">
                    <button
                      className="edit-event"
                      onClick={() =>
                        openEditForm(event)
                      }
                      aria-label={`Edit ${event.name}`}
                    >
                      ✎
                    </button>

                    <button
                      className="delete-event"
                      onClick={() =>
                        handleDeleteEvent(event.id)
                      }
                      aria-label={`Delete ${event.name}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            className="add-calendar-event"
            onClick={openEventForm}
          >
            + Add event
          </button>
        </aside>
      </div>

      {showEventForm && (
        <div className="event-overlay">
          <div className="event-modal">
            <button
              className="close-event"
              onClick={closeEventForm}
            >
              ×
            </button>

            <p className="eyebrow">
              {editingEventId !== null
                ? "♡ EDIT EVENT"
                : "♡ NEW EVENT"}
            </p>

            <h2>
              {editingEventId !== null
                ? "Make a little change ✨"
                : "Add something cute ✨"}
            </h2>

            <p className="event-date">
              {selectedDateText}
            </p>

            <form onSubmit={handleSaveEvent}>
              <label htmlFor="event-name">
                Event name
              </label>

              <input
                id="event-name"
                type="text"
                placeholder="e.g. Finish portfolio..."
                value={eventName}
                onChange={(event) =>
                  setEventName(event.target.value)
                }
                autoFocus
              />

              <div className="event-form-buttons">
                <button
                  type="button"
                  className="cancel-event"
                  onClick={closeEventForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-event"
                >
                  {editingEventId !== null
                    ? "Save Changes ✨"
                    : "Add Event ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Calendar;