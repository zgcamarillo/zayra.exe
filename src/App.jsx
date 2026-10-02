import { useState } from "react";
import "./App.css";

import Calendar from "./components/Calendar";
import Tasks from "./components/Tasks";
import Money from "./components/Money";
import Goals from "./components/Goals";
import Trackers from "./components/Trackers";
import Notes from "./components/Notes";

function App() {
  // ========================================
  // APP STATE
  // ========================================

  const [activePage, setActivePage] =
    useState("home");

  const [resetMessage, setResetMessage] =
    useState("");

  // Shared Tasks state
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks =
        localStorage.getItem("zayra-tasks");

      return savedTasks
        ? JSON.parse(savedTasks)
        : [];
    } catch {
      return [];
    }
  });

  // ========================================
  // NAVIGATION
  // ========================================

  const goTo = (page) => {
    setActivePage(page);
  };

  // ========================================
  // SAVED DATA
  // ========================================

  const getSavedData = (key, fallback) => {
    try {
      const saved =
        localStorage.getItem(key);

      return saved
        ? JSON.parse(saved)
        : fallback;
    } catch {
      return fallback;
    }
  };

  const events = getSavedData(
    "zayra-events",
    {}
  );

  const transactions = getSavedData(
    "zayra-transactions",
    []
  );

  const goals = getSavedData(
    "zayra-goals",
    []
  );

  const trackers = getSavedData(
    "zayra-trackers",
    []
  );

  const notes = getSavedData(
    "zayra-notes",
    []
  );

  // ========================================
  // DATE
  // ========================================

  const today = new Date();

  const currentMonth =
    today.getMonth();

  const currentYear =
    today.getFullYear();

  const monthName =
    today.toLocaleString("default", {
      month: "long",
    });

  const todayKey = `${currentYear}-${String(
    currentMonth + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;

  const todayEvents =
    events[todayKey] || [];

  // ========================================
  // CALENDAR
  // ========================================

  const firstDayOfMonth =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

  const hasEventsOnDay = (day) => {
    const dateKey = `${currentYear}-${String(
      currentMonth + 1
    ).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return (
      events[dateKey] &&
      events[dateKey].length > 0
    );
  };

  // ========================================
  // TASKS
  // ========================================

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const totalTasks =
    tasks.length;

  const remainingTasks =
    totalTasks - completedTasks;

  const taskPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  const homeTasks = [...tasks]
    .sort((a, b) => {
      if (
        a.completed ===
        b.completed
      ) {
        return 0;
      }

      return a.completed ? 1 : -1;
    })
    .slice(0, 4);

  const toggleHomeTask = (taskId) => {
    const updatedTasks =
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
      );

    setTasks(updatedTasks);

    localStorage.setItem(
      "zayra-tasks",
      JSON.stringify(updatedTasks)
    );
  };

  // ========================================
  // MONEY
  // ========================================

  const income =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );

  const expenses =
    transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount || 0
          ),
        0
      );

  const balance =
    income - expenses;

  // ========================================
  // GOALS
  // ========================================

  const getGoalPercentage = (
    goal
  ) => {
    if (
      !goal.target ||
      goal.target <= 0
    ) {
      return 0;
    }

    return Math.min(
      Math.round(
        (Number(
          goal.progress || 0
        ) /
          Number(goal.target)) *
          100
      ),
      100
    );
  };

  const homeGoals =
    goals.slice(0, 3);

  // ========================================
  // TRACKERS
  // ========================================

  const totalCheckIns =
    trackers.reduce(
      (total, tracker) =>
        total +
        (
          tracker.completed ||
          []
        ).filter(Boolean).length,
      0
    );

  // ========================================
  // NOTES
  // ========================================

  const recentNotes =
    notes.slice(0, 2);

  // ========================================
  // CLEAR DATA
  // ========================================

  const handleClearData = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete all ZAYRA.EXE data? This cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "zayra-events"
    );

    localStorage.removeItem(
      "zayra-tasks"
    );

    localStorage.removeItem(
      "zayra-transactions"
    );

    localStorage.removeItem(
      "zayra-goals"
    );

    localStorage.removeItem(
      "zayra-trackers"
    );

    localStorage.removeItem(
      "zayra-notes"
    );

    setResetMessage(
      "All app data has been cleared ♡"
    );

    window.location.reload();
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="life-os">


      <img
        src="/kiss.png"
        alt=""
        className="floating-sticker sticker-kiss"
      />

      {/* ======================================
          TOP BAR
      ====================================== */}

      <header className="top-bar">

        <div className="brand">

          <span className="brand-heart">
            ♡
          </span>

          <div>

            <h1>
              ZAYRA.EXE
            </h1>

            <p>
              LIFE OS
            </p>

          </div>

        </div>

        <div className="top-date">

          <span>
            ♡
          </span>

          <span>
            {currentYear}
          </span>

        </div>

      </header>

      <div className="app-layout">

        {/* ======================================
            SIDEBAR
        ====================================== */}

        <aside className="sidebar">

          <div className="profile-card">

            <div className="profile-pic">
              Z
            </div>

            <div>

              <h2>
                Zee
              </h2>

              <p>
                no thoughts

              </p>

            </div>

          </div>

          <nav className="navigation">

            <button
              className={
                activePage === "home"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("home")
              }
            >
              <span>♡</span>
              Home
            </button>

            <button
              className={
                activePage === "calendar"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("calendar")
              }
            >
              <span>▦</span>
              Calendar
            </button>

            <button
              className={
                activePage === "tasks"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("tasks")
              }
            >
              <span>✓</span>
              Tasks
            </button>

            <button
              className={
                activePage === "money"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("money")
              }
            >
              <span>♡</span>
              Money
            </button>

            <button
              className={
                activePage === "goals"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("goals")
              }
            >
              <span>✦</span>
              Goals
            </button>

            <button
              className={
                activePage === "trackers"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("trackers")
              }
            >
              <span>☆</span>
              Trackers
            </button>

            <button
              className={
                activePage === "notes"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("notes")
              }
            >
              <span>✎</span>
              Notes
            </button>

          </nav>

          <div className="sidebar-bottom">

            <button
              className={
                activePage ===
                "settings"
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                goTo("settings")
              }
            >
              <span>⚙</span>
              Settings
            </button>

            <div className="version">
              zayra.exe v1.0
            </div>

          </div>

        </aside>

        {/* ======================================
            MAIN
        ====================================== */}

        <main className="dashboard">

          {/* ====================================
              CALENDAR
          ==================================== */}

          {activePage ===
            "calendar" && (
            <Calendar />
          )}

          {/* ====================================
              TASKS
          ==================================== */}

          {activePage ===
            "tasks" && (
            <Tasks
              tasks={tasks}
              setTasks={setTasks}
            />
          )}

          {/* ====================================
              MONEY
          ==================================== */}

          {activePage ===
            "money" && (
            <Money />
          )}

          {/* ====================================
              GOALS
          ==================================== */}

          {activePage ===
            "goals" && (
            <Goals />
          )}

          {/* ====================================
              TRACKERS
          ==================================== */}

          {activePage ===
            "trackers" && (
            <Trackers />
          )}

          {/* ====================================
              NOTES
          ==================================== */}

          {activePage ===
            "notes" && (
            <Notes />
          )}

          {/* ====================================
              SETTINGS
          ==================================== */}

          {activePage ===
            "settings" && (
            <section className="settings-page">

              <div className="settings-header">

                <div>

                  <p className="eyebrow">
                    ♡ ZAYRA.EXE
                  </p>

                  <h2>
                    Settings
                  </h2>

                  <p className="settings-subtitle">
                    A little control center for your life OS ✨
                  </p>

                </div>

              </div>

              <div className="settings-grid">

                <div className="dashboard-card settings-card">

                  <p className="card-label">
                    ABOUT
                  </p>

                  <h3>
                    ZAYRA.EXE LIFE OS ♡
                  </h3>

                  <p>
                    Your personal little digital command center for planning, tracking, creating and dreaming.
                  </p>

                  <div className="settings-version">

                    <span>
                      Version
                    </span>

                    <strong>
                      1.0.0
                    </strong>

                  </div>

                </div>

                <div className="dashboard-card settings-card">

                  <p className="card-label">
                    STORAGE
                  </p>

                  <h3>
                    Your data is local 💾
                  </h3>

                  <p>
                    Your calendar, tasks, money, goals, trackers and notes are stored in your browser using LocalStorage.
                  </p>

                  <div className="storage-status">

                    <span className="storage-dot"></span>

                    <span>
                      Local storage active
                    </span>

                  </div>

                </div>

                <div className="dashboard-card settings-card">

                  <p className="card-label">
                    DATA
                  </p>

                  <h3>
                    Reset ZAYRA.EXE
                  </h3>

                  <p>
                    This removes all saved calendar events, tasks, transactions, goals, trackers and notes from this browser.
                  </p>

                  <button
                    className="clear-data-button"
                    onClick={
                      handleClearData
                    }
                  >
                    Clear All Data
                  </button>

                  {resetMessage && (
                    <p className="reset-message">
                      {resetMessage}
                    </p>
                  )}

                </div>

                <div className="dashboard-card settings-card settings-quote">

                  <span>
                    ✦
                  </span>

                  <h3>
                    Little steps still count.
                  </h3>

                  <p>
                    You don't have to have everything figured out. Just keep building your little life, one day at a time.
                  </p>

                </div>

              </div>

            </section>
          )}

          {/* ====================================
              HOME
          ==================================== */}

          {activePage ===
            "home" && (
            <>

              {/* WELCOME */}

              <section className="welcome">

                <div>

                  <p className="eyebrow">
                    ♡ WELCOME BACK
                  </p>

                  <h2>
                    Hey Zayra 
                  </h2>

                  <p className="welcome-text">
                    currently fighting for my life
                  </p>

                </div>

                <div className="sticker">
                  ✦
                </div>

              </section>

              {/* ==================================
                  CALENDAR + TODAY
              ================================== */}

              <section className="dashboard-grid">

                {/* ==================================
                    CALENDAR
                ================================== */}

                <div className="dashboard-card calendar-preview">

                  <div className="card-heading">

                    <div>

                      <p className="card-label">
                        CALENDAR
                      </p>

                      <h3>
                        {monthName}{" "}
                        {currentYear}
                      </h3>

                    </div>

                    <span className="card-icon">
                      ♡
                    </span>

                  </div>

                  <div className="mini-calendar">

                    <div className="weekdays">

                      <span>SUN</span>
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>

                    </div>

                    <div className="calendar-days">

                      {Array.from(
                        {
                          length:
                            firstDayOfMonth,
                        },
                        (_, index) => (
                          <span
                            className="calendar-empty"
                            key={`empty-${index}`}
                          />
                        )
                      )}

                      {Array.from(
                        {
                          length:
                            daysInMonth,
                        },
                        (_, index) => {

                          const day =
                            index + 1;

                          const isToday =
                            day ===
                            today.getDate();

                          const hasEvents =
                            hasEventsOnDay(
                              day
                            );

                          return (
                            <button
                              className={`calendar-day ${
                                isToday
                                  ? "today"
                                  : ""
                              } ${
                                hasEvents
                                  ? "has-event"
                                  : ""
                              }`}
                              key={day}
                              onClick={() =>
                                goTo(
                                  "calendar"
                                )
                              }
                            >

                              <span>
                                {day}
                              </span>

                              {hasEvents && (
                                <small>
                                  ♡
                                </small>
                              )}

                            </button>
                          );
                        }
                      )}

                    </div>

                  </div>

                  <button
                    className="home-card-button"
                    onClick={() =>
                      goTo("calendar")
                    }
                  >
                    Open Calendar →
                  </button>

                </div>

                {/* ==================================
                    TODAY
                ================================== */}

                <div className="dashboard-card today-card">

                  <div className="card-heading">

                    <div>

                      <p className="card-label">
                        TODAY
                      </p>

                      <h3>
                        {today.toLocaleDateString(
                          "default",
                          {
                            month:
                              "long",
                            day: "numeric",
                          }
                        )}
                      </h3>

                    </div>

                    <span className="card-icon">
                      ✦
                    </span>

                  </div>

                  {/* SCHEDULE */}

                  <div className="home-today-section">

                    <p className="home-section-label">
                      SCHEDULE
                    </p>

                    {todayEvents.length ===
                    0 ? (
                      <div className="home-schedule-empty">

                        <span>
                          ♡
                        </span>

                        <p>
                          Nothing scheduled today.
                        </p>

                      </div>
                    ) : (
                      <div className="home-event-list">

                        {todayEvents.map(
                          (event) => (
                            <div
                              className="home-event-item"
                              key={event.id}
                            >

                              <span className="event-symbol">
                                ♡
                              </span>

                              <span>
                                {event.name}
                              </span>

                            </div>
                          )
                        )}

                      </div>
                    )}

                  </div>

                  {/* TASKS */}

                  <div className="home-today-section">

                    <p className="home-section-label">
                      TASKS
                    </p>

                    {homeTasks.length ===
                    0 ? (
                      <div className="home-schedule-empty">

                        <span>
                          ✓
                        </span>

                        <p>
                          No tasks yet.
                        </p>

                      </div>
                    ) : (
                      <div className="home-task-list">

                        {homeTasks
                          .slice(0, 3)
                          .map(
                            (task) => (
                              <div
                                className={`home-task-item ${
                                  task.completed
                                    ? "completed"
                                    : ""
                                }`}
                                key={task.id}
                              >

                                <button
                                  className={
                                    task.completed
                                      ? "home-task-checkbox checked"
                                      : "home-task-checkbox"
                                  }
                                  onClick={() =>
                                    toggleHomeTask(
                                      task.id
                                    )
                                  }
                                  aria-label={
                                    task.completed
                                      ? `Mark ${task.name} incomplete`
                                      : `Mark ${task.name} complete`
                                  }
                                >
                                  {task.completed
                                    ? "✓"
                                    : ""}
                                </button>

                                <span>
                                  {task.name}
                                </span>

                              </div>
                            )
                          )}

                      </div>
                    )}

                  </div>

                  {/* TASK SUMMARY */}

                  <div className="home-task-summary">

                    <div>

                      <strong>
                        {completedTasks } 
                      </strong>

                      <span>
                         done
                      </span>

                    </div>

                    <div>

                      <strong>
                        {remainingTasks}
                      </strong>

                      <span>
                        left
                      </span>

                    </div>

                    <div>

                      <strong>
                        {taskPercentage}%
                      </strong>

                      <span>
                        complete
                      </span>

                    </div>

                  </div>

                  <button
                    className="add-task"
                    onClick={() =>
                      goTo("tasks")
                    }
                  >
                    + Manage Tasks
                  </button>

                </div>

                {/* ==================================
                    GOALS
                ================================== */}

                <div className="dashboard-card goals-card">

                  <div className="card-heading">

                    <div>

                      <p className="card-label">
                        CURRENT GOALS
                      </p>

                      <h3>
                        Little steps ♡
                      </h3>

                    </div>

                    <span className="card-icon">
                      ☆
                    </span>

                  </div>

                  {homeGoals.length ===
                  0 ? (
                    <div className="home-empty-state">

                      <span>
                        ☆
                      </span>

                      <p>
                        No goals yet.
                      </p>

                      <small>
                        Give yourself something to work toward.
                      </small>

                    </div>
                  ) : (
                    homeGoals.map(
                      (goal) => {

                        const percentage =
                          getGoalPercentage(
                            goal
                          );

                        return (
                          <div
                            className="goal"
                            key={goal.id}
                          >

                            <div className="goal-top">

                              <span>
                                {goal.name}
                              </span>

                              <span>
                                {percentage}%
                              </span>

                            </div>

                            <div className="progress">

                              <div
                                className="progress-fill career"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />

                            </div>

                          </div>
                        );
                      }
                    )
                  )}

                  <button
                    className="home-card-button"
                    onClick={() =>
                      goTo("goals")
                    }
                  >
                    View Goals →
                  </button>

                </div>

                {/* ==================================
                    MONEY
                ================================== */}

                <div className="dashboard-card home-money-card">

                  <div className="card-heading">

                    <div>

                      <p className="card-label">
                        MONEY
                      </p>

                      <h3>
                        My money ♡
                      </h3>

                    </div>

                    <span className="card-icon">
                      $
                    </span>

                  </div>

                  <div className="home-money-balance">

                    <span>
                      Current balance
                    </span>

                    <strong>
                      $
                      {balance.toFixed(
                        2
                      )}
                    </strong>

                  </div>

                  <div className="home-money-stats">

                    <div>

                      <span>
                        Income
                      </span>

                      <strong>
                        +$
                        {income.toFixed(
                          2
                        )}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Expenses
                      </span>

                      <strong>
                        -$
                        {expenses.toFixed(
                          2
                        )}
                      </strong>

                    </div>

                  </div>

                  <button
                    className="home-card-button"
                    onClick={() =>
                      goTo("money")
                    }
                  >
                    Open Money →
                  </button>

                </div>

                {/* ==================================
                    TRACKERS
                ================================== */}

                <div className="dashboard-card currently-card">

                  <div className="card-heading">

                    <div>

                      <p className="card-label">
                        TRACKERS
                      </p>

                      <h3>
                        My little routine
                      </h3>

                    </div>

                    <span className="card-icon">
                      ☆
                    </span>

                  </div>

                  {trackers.length ===
                  0 ? (
                    <div className="home-empty-state">

                      <span>
                        ☆
                      </span>

                      <p>
                        No trackers yet.
                      </p>

                      <small>
                        Start building your routine.
                      </small>

                    </div>
                  ) : (
                    <>

                      {trackers
                        .slice(0, 3)
                        .map(
                          (
                            tracker
                          ) => {

                            const completed =
                              (
                                tracker.completed ||
                                []
                              ).filter(
                                Boolean
                              ).length;

                            return (
                              <div
                                className="home-tracker-row"
                                key={
                                  tracker.id
                                }
                              >

                                <span>
                                  {
                                    tracker.name
                                  }
                                </span>

                                <strong>
                                  {
                                    completed
                                  }
                                  /7
                                </strong>

                              </div>
                            );
                          }
                        )}

                      <div className="home-tracker-total">

                        <strong>
                          {totalCheckIns}
                        </strong>

                        <span>
                          check-ins this week
                        </span>

                      </div>

                    </>
                  )}

                  <button
                    className="home-card-button"
                    onClick={() =>
                      goTo(
                        "trackers"
                      )
                    }
                  >
                    View Trackers →
                  </button>

                </div>

                {/* ==================================
                    NOTES
                ================================== */}

                <div className="dashboard-card home-notes-card">

                  <div className="card-heading">

                    <div>

                      <p className="card-label">
                        RECENT NOTES
                      </p>

                      <h3>
                        Little thoughts ♡
                      </h3>

                    </div>

                    <span className="card-icon">
                      ✎
                    </span>

                  </div>

                  {recentNotes.length ===
                  0 ? (
                    <div className="home-empty-state">

                      <span>
                        ♡
                      </span>

                      <p>
                        No notes yet.
                      </p>

                      <small>
                        Your thoughts can live here.
                      </small>

                    </div>
                  ) : (
                    <div className="home-notes-list">

                      {recentNotes.map(
                        (note) => (
                          <div
                            className="home-note-preview"
                            key={note.id}
                          >

                            <strong>
                              {note.title}
                            </strong>

                            <span>
                              {note.content
                                ? note.content.slice(
                                    0,
                                    65
                                  )
                                : "No content yet..."}
                            </span>

                          </div>
                        )
                      )}

                    </div>
                  )}

                  <button
                    className="home-card-button"
                    onClick={() =>
                      goTo("notes")
                    }
                  >
                    Open Notes →
                  </button>

                </div>

              </section>

            </>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;