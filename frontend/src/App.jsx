import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get(API_URL).then((res) => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await axios.post(API_URL, { text: newTask });
    setTasks([...tasks, res.data]);
    setNewTask("");
  };

  const toggleTask = async (id, done) => {
    const res = await axios.put(`${API_URL}/${id}`, { done: !done });
    setTasks(tasks.map((t) => (t.id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <>
      <h1>TASK LIST</h1>
      <ul>
        {tasks.map((t) => (
          <li style={{ textDecoration: t.done ? "line-through" : "none" }}>
            {t.text} <button onClick={() => toggleTask(t.id, t.done)}>TOGGLE</button>{" "}<button onClick={() => deleteTask(t.id)}>DELETE</button>
          </li>
        ))}
      </ul>
      <h1>NEW TASK</h1>
      <input
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      ></input>
      {" "}
      <button onClick={() => addTask()}>ADD</button>
    </>
  );
}

export default App;
