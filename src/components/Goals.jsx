import { useState } from "react";

function Goals() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("zayra-goals");

    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);

    localStorage.setItem(
      "zayra-goals",
      JSON.stringify(updatedGoals)
    );
  };

  const handleAddGoal = (event) => {
    event.preventDefault();

    if (!goalName.trim() || !goalTarget) {
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: goalName.trim(),
      target: Number(goalTarget),
      progress: 0,
    };

    saveGoals([...goals, newGoal]);

    setGoalName("");
    setGoalTarget("");
  };

  const handleAddProgress = (goalId) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id !== goalId) {
        return goal;
      }

      const amount = Number(
        window.prompt(
          `How much progress did you make toward "${goal.name}"?`
        )
      );

      if (!amount || amount <= 0) {
        return goal;
      }

      return {
        ...goal,
        progress: Math.min(
          goal.progress + amount,
          goal.target
        ),
      };
    });

    saveGoals(updatedGoals);
  };

  const handleDeleteGoal = (goalId) => {
    const updatedGoals = goals.filter(
      (goal) => goal.id !== goalId
    );

    saveGoals(updatedGoals);
  };

  const getPercentage = (goal) => {
    if (goal.target <= 0) {
      return 0;
    }

    return Math.min(
      Math.round(
        (goal.progress / goal.target) * 100
      ),
      100
    );
  };

  return (
    <section className="goals-page">
      <div className="goals-header">
        <div>
          <p className="eyebrow">
            ♡ DREAM BIG
          </p>

          <h2>
            My Goals
          </h2>

          <p className="goals-subtitle">
            future me can handle it
          </p>
        </div>

        <div className="goals-count">
          <strong>
            {goals.length}
          </strong>

          <span>
            active goals
          </span>
        </div>
      </div>

      <div className="dashboard-card goal-form-card">
        <div className="card-heading">
          <div>
            <p className="card-label">
              NEW GOAL
            </p>

            <h3>
              What are we working toward? ♡
            </h3>
          </div>

          <span className="card-icon">
            ✦
          </span>
        </div>

        <form
          className="goal-form"
          onSubmit={handleAddGoal}
        >
          <input
            type="text"
            placeholder="e.g. Save for a car"
            value={goalName}
            onChange={(event) =>
              setGoalName(event.target.value)
            }
          />

          <input
            type="number"
            min="1"
            step="0.01"
            placeholder="Target amount"
            value={goalTarget}
            onChange={(event) =>
              setGoalTarget(event.target.value)
            }
          />

          <button type="submit">
            + Add Goal
          </button>
        </form>
      </div>

      {goals.length === 0 ? (
        <div className="dashboard-card goals-empty">
          <span>
            ☆
          </span>

          <h3>
            No goals yet
          </h3>

          <p>
            Give yourself something cute to work toward.
          </p>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => {
            const percentage =
              getPercentage(goal);

            return (
              <div
                className="dashboard-card goal-item"
                key={goal.id}
              >
                <div className="goal-item-header">
                  <div>
                    <p className="card-label">
                      GOAL
                    </p>

                    <h3>
                      {goal.name}
                    </h3>
                  </div>

                  <button
                    className="goal-delete"
                    onClick={() =>
                      handleDeleteGoal(goal.id)
                    }
                    aria-label={`Delete ${goal.name}`}
                  >
                    ×
                  </button>
                </div>

                <div className="goal-amounts">
                  <strong>
                    ${goal.progress.toFixed(2)}
                  </strong>

                  <span>
                    of ${goal.target.toFixed(2)}
                  </span>
                </div>

                <div className="goal-progress-bar">
                  <div
                    className="goal-progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <div className="goal-progress-info">
                  <span>
                    {percentage}% complete
                  </span>

                  <span>
                    $
                    {Math.max(
                      goal.target -
                        goal.progress,
                      0
                    ).toFixed(2)}{" "}
                    left
                  </span>
                </div>

                <button
                  className="goal-progress-button"
                  onClick={() =>
                    handleAddProgress(goal.id)
                  }
                >
                  + Add Progress
                </button>

                {percentage === 100 && (
                  <div className="goal-complete">
                    ✨ Goal complete! ✨
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Goals;