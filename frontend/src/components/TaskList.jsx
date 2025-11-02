import { useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const { logout } = useAuth()

  useEffect(() => {
    api.get("/tasks").then((res) => {
      setTasks(res.data);
    });
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await api.post("/tasks", { text: newTask });
    setTasks([...tasks, res.data]);
    setNewTask("");
  };
  
  const toggleTask = async (id, done) => {
    const res = await api.put(`/tasks/${id}`, { done: !done });
    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <>
      <h1>TASK LIST</h1>
      <ul>
        {tasks.map((t) => (
          <li >
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>
        {t.text}
      </span>{" "}
            <button onClick={() => toggleTask(t.id, t.done)}>TOGGLE</button>{" "}
            <button onClick={() => deleteTask(t.id)}>DELETE</button>
          </li>
        ))}
      </ul>
      <h1>NEW TASK</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      ></input>{" "}
      <button onClick={() => addTask()}>ADD</button>
      <br/>
      <br/>
      <div>
        <button onClick={logout}>LOG OUT</button>
      </div>
    </>
  );
}
