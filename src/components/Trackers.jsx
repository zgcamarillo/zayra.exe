import { useState } from "react";

function Trackers() {
  const [trackers, setTrackers] = useState(() => {
    const savedTrackers = localStorage.getItem(
      "zayra-trackers"
    );

    return savedTrackers
      ? JSON.parse(savedTrackers)
      : [];
  });

  const [trackerName, setTrackerName] = useState("");

  const days = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ];

  const saveTrackers = (updatedTrackers) => {
    setTrackers(updatedTrackers);

    localStorage.setItem(
      "zayra-trackers",
      JSON.stringify(updatedTrackers)
    );
  };

  const handleAddTracker = (event) => {
    event.preventDefault();

    if (!trackerName.trim()) {
      return;
    }

    const newTracker = {
      id: Date.now(),
      name: trackerName.trim(),
      completed: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    };

    saveTrackers([
      ...trackers,
      newTracker,
    ]);

    setTrackerName("");
  };

  const toggleDay = (trackerId, dayIndex) => {
    const updatedTrackers = trackers.map(
      (tracker) => {
        if (tracker.id !== trackerId) {
          return tracker;
        }

        const updatedDays = [
          ...tracker.completed,
        ];

        updatedDays[dayIndex] =
          !updatedDays[dayIndex];

        return {
          ...tracker,
          completed: updatedDays,
        };
      }
    );

    saveTrackers(updatedTrackers);
  };

  const deleteTracker = (trackerId) => {
    const updatedTrackers =
      trackers.filter(
        (tracker) =>
          tracker.id !== trackerId
      );

    saveTrackers(updatedTrackers);
  };

  const getCompletedCount = (tracker) => {
    return tracker.completed.filter(
      Boolean
    ).length;
  };

  const totalCompleted = trackers.reduce(
    (total, tracker) =>
      total +
      getCompletedCount(tracker),
    0
  );

  return (
    <section className="trackers-page">
      <div className="trackers-header">
        <div>
          <p className="eyebrow">
            ♡ BUILD YOUR ROUTINE
          </p>

          <h2>
            My Trackers
          </h2>

          <p className="trackers-subtitle">
            proof you have your life together
          </p>
        </div>

        <div className="tracker-week-count">
          <strong>
            {totalCompleted}
          </strong>

          <span>
            check-ins this week
          </span>
        </div>
      </div>

      <div className="dashboard-card tracker-form-card">
        <div className="card-heading">
          <div>
            <p className="card-label">
              NEW TRACKER
            </p>

            <h3>
              What do you want to keep up with? ♡
            </h3>
          </div>

          <span className="card-icon">
            ☆
          </span>
        </div>

        <form
          className="tracker-form"
          onSubmit={handleAddTracker}
        >
          <input
            type="text"
            placeholder="e.g. Drink water"
            value={trackerName}
            onChange={(event) =>
              setTrackerName(
                event.target.value
              )
            }
          />

          <button type="submit">
            + Add Tracker
          </button>
        </form>
      </div>

      {trackers.length === 0 ? (
        <div className="dashboard-card trackers-empty">
          <span>
            ☆
          </span>

          <h3>
            No trackers yet
          </h3>

          <p>
            Add a habit and start building your little routine.
          </p>
        </div>
      ) : (
        <div className="tracker-list">
          {trackers.map((tracker) => {
            const completedCount =
              getCompletedCount(
                tracker
              );

            const percentage = Math.round(
              (completedCount / 7) * 100
            );

            return (
              <div
                className="dashboard-card tracker-card"
                key={tracker.id}
              >
                <div className="tracker-card-header">
                  <div>
                    <p className="card-label">
                      HABIT
                    </p>

                    <h3>
                      {tracker.name}
                    </h3>
                  </div>

                  <button
                    className="tracker-delete"
                    onClick={() =>
                      deleteTracker(
                        tracker.id
                      )
                    }
                    aria-label={`Delete ${tracker.name}`}
                  >
                    ×
                  </button>
                </div>

                <div className="tracker-days">
                  {days.map(
                    (day, index) => (
                      <div
                        className="tracker-day"
                        key={day}
                      >
                        <span>
                          {day}
                        </span>

                        <button
                          className={
                            tracker.completed[
                              index
                            ]
                              ? "day-check completed"
                              : "day-check"
                          }
                          onClick={() =>
                            toggleDay(
                              tracker.id,
                              index
                            )
                          }
                          aria-label={`${tracker.name} ${day}`}
                        >
                          {tracker.completed[
                            index
                          ]
                            ? "✓"
                            : ""}
                        </button>
                      </div>
                    )
                  )}
                </div>

                <div className="tracker-bottom">
                  <div className="tracker-progress">
                    <div className="tracker-progress-top">
                      <span>
                        This week
                      </span>

                      <span>
                        {completedCount}/7
                      </span>
                    </div>

                    <div className="progress">
                      <div
                        className="progress-fill tracker-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="tracker-percentage">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Trackers;