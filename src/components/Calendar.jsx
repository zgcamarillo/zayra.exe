import { useEffect, useState } from "react";

const getDateKey = (date) => {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const formatTime = (time) => {
  if (!time) {
    return "";
  }

  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

function Calendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [events, setEvents] = useState(() => {
    const savedEvents =
      localStorage.getItem("zayra-events");

    return savedEvents
      ? JSON.parse(savedEvents)
      : {};
  });

  const [showEventForm, setShowEventForm] =
    useState(false);

  const [eventName, setEventName] =
    useState("");

  const [eventTime, setEventTime] =
    useState("");

  const [eventPriority, setEventPriority] =
    useState("normal");

  const [editingEvent, setEditingEvent] =
    useState(null);

  useEffect(() => {
    localStorage.setItem(
      "zayra-events",
      JSON.stringify(events)
    );
  }, [events]);

  const year =
    currentMonth.getFullYear();

  const month =
    currentMonth.getMonth();

  const monthName =
    currentMonth.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  const firstDay =
    new Date(year, month, 1).getDay();

  const daysInMonth =
    new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(
      new Date(year, month, day)
    );
  }

  const selectedDateKey =
    getDateKey(selectedDate);

  const selectedEvents =
    events[selectedDateKey] || [];

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      )
    );

    setSelectedDate(now);
  };

  const isToday = (date) => {
    if (!date) {
      return false;
    }

    return (
      getDateKey(date) ===
      getDateKey(today)
    );
  };

  const hasEvents = (date) => {
    if (!date) {
      return false;
    }

    const dateKey =
      getDateKey(date);

    return (
      events[dateKey] &&
      events[dateKey].length > 0
    );
  };

  const handleDateClick = (date) => {
    if (!date) {
      return;
    }

    setSelectedDate(date);
  };

  const openAddEvent = () => {
    setEditingEvent(null);
    setEventName("");
    setEventTime("");
    setEventPriority("normal");
    setShowEventForm(true);
  };

  const openEditEvent = (event) => {
    setEditingEvent(event);
    setEventName(event.name);
    setEventTime(event.time || "");
    setEventPriority(event.priority || "normal");
    setShowEventForm(true);
  };

  const closeEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
    setEventName("");
    setEventTime("");
    setEventPriority("normal");
  };

  const handleSaveEvent = (event) => {
    event.preventDefault();

    if (!eventName.trim()) {
      return;
    }

    const dateKey =
      getDateKey(selectedDate);

    const currentEvents =
      events[dateKey] || [];

    if (editingEvent) {
      const updatedEvents =
        currentEvents.map(
          (item) =>
            item.id === editingEvent.id
              ? {
                  ...item,
                  name: eventName.trim(),
                  time: eventTime,
                  priority: eventPriority,
                }
              : item
        );

      setEvents({
        ...events,
        [dateKey]: updatedEvents,
      });
    } else {
      const newEvent = {
        id: Date.now(),
        name: eventName.trim(),
        time: eventTime,
        priority: eventPriority,
      };

      setEvents({
        ...events,
        [dateKey]: [
          ...currentEvents,
          newEvent,
        ],
      });
    }

    closeEventForm();
  };

  const handleDeleteEvent = (eventId) => {
    const dateKey =
      getDateKey(selectedDate);

    const updatedEvents =
      (events[dateKey] || []).filter(
        (event) =>
          event.id !== eventId
      );

    const newEvents = {
      ...events,
    };

    if (updatedEvents.length === 0) {
      delete newEvents[dateKey];
    } else {
      newEvents[dateKey] =
        updatedEvents;
    }

    setEvents(newEvents);

    if (
      editingEvent &&
      editingEvent.id === eventId
    ) {
      closeEventForm();
    }
  };

  const sortedSelectedEvents =
    [...selectedEvents].sort(
      (a, b) => {
        if (!a.time && !b.time) {
          return 0;
        }

        if (!a.time) {
          return 1;
        }

        if (!b.time) {
          return -1;
        }

        return a.time.localeCompare(
          b.time
        );
      }
    );

  return (
    <section className="calendar-page">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="calendar-header">

        <div>
          <p className="eyebrow">
            ♡ PLAN YOUR DAYS
          </p>

          <h2>
            My Calendar
          </h2>

          <p className="calendar-subtitle">
            who scheduled all this?
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddEvent}
        >
          + Add Event
        </button>

      </div>


      {/* =====================================================
          CALENDAR CARD
          ===================================================== */}

      <div className="calendar-layout">

        <div className="dashboard-card calendar-main">

          <div className="calendar-controls">

            <button
              className="calendar-nav-button"
              onClick={
                goToPreviousMonth
              }
              aria-label="Previous month"
            >
              ‹
            </button>

            <div className="calendar-month-title">

              <h3>
                {monthName}
              </h3>

              <button
                className="calendar-today-button"
                onClick={goToToday}
              >
                Today
              </button>

            </div>

            <button
              className="calendar-nav-button"
              onClick={
                goToNextMonth
              }
              aria-label="Next month"
            >
              ›
            </button>

          </div>


          {/* =================================================
              WEEKDAYS
              ================================================= */}

          <div className="calendar-weekdays">

            {[
              "SUN",
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT",
            ].map((day) => (
              <span key={day}>
                {day}
              </span>
            ))}

          </div>


          {/* =================================================
              DAYS
              ================================================= */}

          <div className="calendar-grid">

            {calendarDays.map(
              (date, index) => {

                if (!date) {
                  return (
                    <div
                      className="calendar-empty"
                      key={`empty-${index}`}
                    />
                  );
                }

                const dateKey =
                  getDateKey(date);

                const isSelected =
                  dateKey ===
                  selectedDateKey;

                return (
                  <button
                    key={dateKey}
                    className={`calendar-date ${
                      isToday(date)
                        ? "today"
                        : ""
                    } ${
                      isSelected
                        ? "selected"
                        : ""
                    } ${
                      hasEvents(date)
                        ? "has-event"
                        : ""
                    }`}
                    onClick={() =>
                      handleDateClick(
                        date
                      )
                    }
                  >

                    <span>
                      {date.getDate()}
                    </span>

                    {hasEvents(
                      date
                    ) && (
                      <span className="event-dot" />
                    )}

                  </button>
                );
              }
            )}

          </div>

        </div>


        {/* =====================================================
            SELECTED DATE / EVENTS
            ===================================================== */}

        <aside className="dashboard-card calendar-events-card">

          <div className="calendar-events-header">

            <div>

              <p className="card-label">
                YOUR DAY
              </p>

              <h3>
                {selectedDate.toLocaleDateString(
                  "en-US",
                  {
                    weekday:
                      "long",
                    month:
                      "long",
                    day: "numeric",
                  }
                )}
              </h3>

            </div>

            <button
              className="calendar-add-small"
              onClick={
                openAddEvent
              }
              aria-label="Add event"
            >
              +
            </button>

          </div>


          {/* =================================================
              EVENTS
              ================================================= */}

          {sortedSelectedEvents.length ===
          0 ? (
            <div className="calendar-no-events">

              <span className="calendar-empty-heart">
                ♡
              </span>

              <p>
                Nothing planned yet.
              </p>

              <small>
                Pretty sure I had plans
              </small>

              <button
                className="home-card-button"
                onClick={
                  openAddEvent
                }
              >
                + Add something
              </button>

            </div>
          ) : (
            <div className="calendar-event-list">

              {sortedSelectedEvents.map(
                (event) => (
                  <div
                    className={`calendar-event priority-${event.priority || "normal"}`}
                    key={event.id}
                  >

                    <div className="calendar-event-time">

                      <span>
                        {event.time
                          ? formatTime(
                              event.time
                            )
                          : "Anytime"}
                      </span>

                    </div>

                    <div className="calendar-event-info">

                      <strong>
                        {event.name}
                      </strong>

                      <span className="calendar-event-priority">
                        {event.priority ===
                        "important"
                          ? "🔴 Important"
                          : event.priority ===
                            "reminder"
                          ? "🟡 Reminder"
                          : "⚪ Normal"}
                      </span>

                    </div>

                    <div className="calendar-event-actions">

                      <button
                        onClick={() =>
                          openEditEvent(
                            event
                          )
                        }
                        aria-label={`Edit ${event.name}`}
                      >
                        ✎
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteEvent(
                            event.id
                          )
                        }
                        aria-label={`Delete ${event.name}`}
                      >
                        ×
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </aside>

      </div>


      {/* =====================================================
          ADD / EDIT EVENT MODAL
          ===================================================== */}

      {showEventForm && (
        <div
          className="calendar-modal-overlay"
          onClick={
            closeEventForm
          }
        >

          <div
            className="calendar-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="calendar-modal-header">

              <div>

                <p className="card-label">
                  {editingEvent
                    ? "EDIT EVENT"
                    : "NEW EVENT"}
                </p>

                <h3>
                  {editingEvent
                    ? "Update your plans ♡"
                    : "What's happening?"}
                </h3>

              </div>

              <button
                className="calendar-modal-close"
                onClick={
                  closeEventForm
                }
                aria-label="Close"
              >
                ×
              </button>

            </div>


            <form
              className="calendar-event-form"
              onSubmit={
                handleSaveEvent
              }
            >

              {/* EVENT */}

              <label>
                <span>
                  EVENT
                </span>

                <input
                  type="text"
                  value={eventName}
                  onChange={(event) =>
                    setEventName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Dentist appointment"
                  autoFocus
                />
              </label>


              {/* TIME */}

              <label>
                <span>
                  TIME
                </span>

                <input
                  type="time"
                  value={eventTime}
                  onChange={(event) =>
                    setEventTime(
                      event.target.value
                    )
                  }
                />

                <small>
                  Leave blank if it can happen anytime.
                </small>
              </label>


              {/* PRIORITY */}

              <div className="calendar-priority-field">

                <span className="calendar-form-label">
                  PRIORITY
                </span>

                <div className="calendar-priority-options">

                  <label className="priority-option">

                    <input
                      type="radio"
                      name="eventPriority"
                      value="normal"
                      checked={
                        eventPriority ===
                        "normal"
                      }
                      onChange={(event) =>
                        setEventPriority(
                          event.target.value
                        )
                      }
                    />

                    <span className="priority-dot normal"></span>

                    <span>
                      Normal
                    </span>

                  </label>


                  <label className="priority-option">

                    <input
                      type="radio"
                      name="eventPriority"
                      value="reminder"
                      checked={
                        eventPriority ===
                        "reminder"
                      }
                      onChange={(event) =>
                        setEventPriority(
                          event.target.value
                        )
                      }
                    />

                    <span className="priority-dot reminder"></span>

                    <span>
                      Reminder
                    </span>

                  </label>


                  <label className="priority-option">

                    <input
                      type="radio"
                      name="eventPriority"
                      value="important"
                      checked={
                        eventPriority ===
                        "important"
                      }
                      onChange={(event) =>
                        setEventPriority(
                          event.target.value
                        )
                      }
                    />

                    <span className="priority-dot important"></span>

                    <span>
                      Important
                    </span>

                  </label>

                </div>

                <small>
                  Important events will be highlighted by ZAYRA AI.
                </small>

              </div>


              {/* FORM ACTIONS */}

              <div className="calendar-form-actions">

                <button
                  type="button"
                  className="calendar-cancel-button"
                  onClick={
                    closeEventForm
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingEvent
                    ? "Save Changes"
                    : "Add Event"}
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