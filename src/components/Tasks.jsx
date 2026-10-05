import { useState } from "react";

function Tasks({ tasks, setTasks }) {
  const [taskName, setTaskName] = useState("");
  const [editingTaskId, setEditingTaskId] =
    useState(null);

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);

    localStorage.setItem(
      "zayra-tasks",
      JSON.stringify(updatedTasks)
    );
  };

  const handleAddTask = (event) => {
    event.preventDefault();

    if (!taskName.trim()) {
      return;
    }

    if (editingTaskId !== null) {
      const updatedTasks = tasks.map(
        (task) =>
          task.id === editingTaskId
            ? {
                ...task,
                name: taskName.trim(),
              }
            : task
      );

      saveTasks(updatedTasks);

      setEditingTaskId(null);
      setTaskName("");

      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      completed: false,
    };

    saveTasks([
      ...tasks,
      newTask,
    ]);

    setTaskName("");
  };

  const handleEditTask = (task) => {
    setTaskName(task.name);
    setEditingTaskId(task.id);
  };

  const handleCancelEdit = () => {
    setTaskName("");
    setEditingTaskId(null);
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = tasks.map(
      (task) =>
        task.id === taskId
          ? {
              ...task,
              completed:
                !task.completed,
            }
          : task
    );

    saveTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks =
      tasks.filter(
        (task) =>
          task.id !== taskId
      );

    saveTasks(updatedTasks);

    if (
      editingTaskId === taskId
    ) {
      handleCancelEdit();
    }
  };

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const totalTasks =
    tasks.length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  return (
    <section className="tasks-page">

      <div className="tasks-header">

        <div>

          <p className="eyebrow">
            ♡ GET THINGS DONE
          </p>

          <h2>
            My Tasks
          </h2>

          <p className="tasks-subtitle">
            look at you being productive
          </p>

        </div>

        <div className="task-progress-card">

          <span>
            {completedTasks}/
            {totalTasks}
          </span>

          <small>
            completed
          </small>

        </div>

      </div>

      <div className="tasks-layout">

        <div className="dashboard-card task-list-card">

          <div className="card-heading">

            <div>

              <p className="card-label">
                MY LIST
              </p>

              <h3>
                Today's little to-dos ♡
              </h3>

            </div>

            <span className="card-icon">
              ✓
            </span>

          </div>

          <form
            className="task-form"
            onSubmit={
              handleAddTask
            }
          >

            <input
              type="text"
              placeholder={
                editingTaskId !==
                null
                  ? "Edit your task..."
                  : "What needs to get done?"
              }
              value={taskName}
              onChange={(event) =>
                setTaskName(
                  event.target.value
                )
              }
            />

            <button type="submit">
              {editingTaskId !==
              null
                ? "Save"
                : "+ Add"}
            </button>

            {editingTaskId !==
              null && (
              <button
                type="button"
                className="cancel-task-edit"
                onClick={
                  handleCancelEdit
                }
              >
                Cancel
              </button>
            )}

          </form>

          {tasks.length === 0 ? (
            <div className="tasks-empty">

              <span>
                ♡
              </span>

              <p>
                Your task list is empty.
              </p>

              <small>
                Add your first little task above ✨
              </small>

            </div>
          ) : (
            <div className="task-list">

              {tasks.map(
                (task) => (
                  <div
                    className={`task-item ${
                      task.completed
                        ? "completed"
                        : ""
                    }`}
                    key={task.id}
                  >

                    <button
                      className="task-checkbox"
                      onClick={() =>
                        handleToggleTask(
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

                    <span className="task-name">
                      {task.name}
                    </span>

                    <button
                      className="task-edit"
                      onClick={() =>
                        handleEditTask(
                          task
                        )
                      }
                      aria-label={`Edit ${task.name}`}
                    >
                      ✎
                    </button>

                    <button
                      className="task-delete"
                      onClick={() =>
                        handleDeleteTask(
                          task.id
                        )
                      }
                      aria-label={`Delete ${task.name}`}
                    >
                      ×
                    </button>

                  </div>
                )
              )}

            </div>
          )}

        </div>

        <aside className="dashboard-card task-summary-card">

          <p className="card-label">
            PROGRESS
          </p>

          <h3>
            You're doing great sweetie! ♡
          </h3>

          <div className="task-progress">

            <div className="task-progress-top">

              <span>
                Completed
              </span>

              <span>
                {completionPercentage}%
              </span>

            </div>

            <div className="progress">

              <div
                className="progress-fill career"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />

            </div>

          </div>

          <div className="task-stats">

            <div>

              <strong>
                {totalTasks}
              </strong>

              <span>
                total
              </span>

            </div>

            <div>

              <strong>
                {completedTasks}
              </strong>

              <span>
                done
              </span>

            </div>

            <div>

              <strong>
                {totalTasks -
                  completedTasks}
              </strong>

              <span>
                left
              </span>

            </div>

          </div>

        </aside>

      </div>

    </section>
  );
}

export default Tasks;