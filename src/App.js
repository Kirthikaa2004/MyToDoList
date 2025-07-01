// src/App.js
import React, { useState, useEffect } from "react";
import { auth, signInWithPopup, signOut, provider } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

  // 👉 Replace with YOUR Cyclic backend URL
  const BASE_URL = "https://your-cyclic-app.cyclic.app";

  // — LOGIN —
  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const u = result.user;
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
        localStorage.setItem("email", u.email);
        loadTasks(u.email);
      })
      .catch((error) => {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      });
  };

  // — LOGOUT —
  const logout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("email");
        setTasks([]);
      })
      .catch((error) => {
        console.error("Logout error:", error);
        alert("Logout failed: " + error.message);
      });
  };

  // — LOAD TASKS —
  const loadTasks = (email) => {
    fetch(`${BASE_URL}/tasks?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error(err);
        alert("Error loading tasks: " + err.message);
      });
  };

  // — ADD TASK —
  const handleAddTask = () => {
    const email = localStorage.getItem("email");
    if (!task.trim() || !email) return;

    fetch(`${BASE_URL}/tasks?email=${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task })
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([newTask, ...tasks]);
        setTask("");
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding task: " + err.message);
      });
  };

  // — TOGGLE TASK —
  const handleToggleStatus = (i) => {
    const t = tasks[i];
    const email = localStorage.getItem("email");
    fetch(`${BASE_URL}/tasks/${t.id}/toggle?email=${email}`, {
      method: "PUT"
    })
      .then((res) => res.json())
      .then((updated) => {
        const copy = [...tasks];
        copy[i] = updated;
        setTasks(copy);
      })
      .catch((err) => {
        console.error(err);
        alert("Error toggling task: " + err.message);
      });
  };

  // — DELETE TASK —
  const handleDelete = (i) => {
    const t = tasks[i];
    const email = localStorage.getItem("email");
    fetch(`${BASE_URL}/tasks/${t.id}?email=${email}`, {
      method: "DELETE"
    })
      .then(() => {
        const copy = [...tasks];
        copy.splice(i, 1);
        setTasks(copy);
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting task: " + err.message);
      });
  };

  // — RESTORE USER ON PAGE LOAD —
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const email = localStorage.getItem("email");
    if (stored && email) {
      setUser(stored);
      loadTasks(email);
    }
  }, []);

  return (
    <div className="container">
      {user ? (
        <div className="auth-header">
          <p>Welcome, {user.displayName}! 🎉</p>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      ) : (
        <button onClick={loginWithGoogle} className="google-login-btn">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            className="google-icon"
          />
          <span>Sign in with Google</span>
        </button>
      )}

      {user && (
        <>
          <h1>My Stylish Todo List</h1>
          <div className="input-group">
            <input
              type="text"
              placeholder="Add a new task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <button onClick={handleAddTask}>Add</button>
          </div>
          <ul className="task-list">
            {tasks.map((t, i) => (
              <li
                key={t.id}
                className={`task-item ${t.status === "Completed" ? "completed" : ""}`}
              >
                <span>{t.text}</span>
                <span
                  className={`status-badge ${t.status === "Completed" ? "completed-badge" : "progress-badge"}`}
                >
                  {t.status}
                </span>
                <button onClick={() => handleToggleStatus(i)}>Toggle</button>
                <button onClick={() => handleDelete(i)}>❌</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
