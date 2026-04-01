import axios from "axios";
import Login from "./Login";
import Signup from "./Signup";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const fetchAIQuote = async () => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: "Give me a short motivational quote for productivity (max 12 words)."
          }
        ]
      },
      {
        headers: {
          "Authorization": "Bearer YOUR_API_KEY",
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    return "Stay consistent and keep moving forward.";
  }
};

const CATEGORIES = ["Work", "Study", "Health", "Personal"];
const PRIORITIES = ["High", "Medium", "Low"];
const PROGRESS_STATUSES = ["Not Started", "In Progress", "Completed"];
const PRIORITY_COLORS = { High: "#E24B4A", Medium: "#EF9F27", Low: "#639922" };
const PRIORITY_BG = { High: "#FCEBEB", Medium: "#FAEEDA", Low: "#EAF3DE" };
const PRIORITY_TEXT = { High: "#791F1F", Medium: "#633806", Low: "#27500A" };
const CAT_COLORS = { Work: "#378ADD", Study: "#7F77DD", Health: "#1D9E75", Personal: "#D4537E" };
const CAT_BG = { Work: "#E6F1FB", Study: "#EEEDFE", Health: "#E1F5EE", Personal: "#FBEAF0" };
const CAT_TEXT = { Work: "#0C447C", Study: "#3C3489", Health: "#085041", Personal: "#72243E" };
const STATUS_BG = { "Not Started": "#F1EFE8", "In Progress": "#E6F1FB", "Completed": "#E1F5EE" };
const STATUS_TEXT = { "Not Started": "#5F5E5A", "In Progress": "#0C447C", "Completed": "#085041" };

const now = new Date();
const todayStr = now.toISOString().split("T")[0];
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r.toISOString().split("T")[0]; }

const SAMPLE_GOALS = [
  { id: "g1", type: "1month", title: "Launch personal portfolio site", description: "Design and deploy a portfolio showcasing my projects", deadline: addDays(now, 25), priority: "High", category: "Work", progressStatus: "In Progress", progress: 60, subtasks: [{ id: "s1", title: "Design wireframes", done: true }, { id: "s2", title: "Build with React", done: true }, { id: "s3", title: "Write case studies", done: false }, { id: "s4", title: "Deploy to Vercel", done: false }] },
  { id: "g2", type: "1month", title: "Complete JavaScript DSA course", description: "Finish all 120 lessons on Udemy", deadline: addDays(now, 28), priority: "Medium", category: "Study", progressStatus: "In Progress", progress: 35, subtasks: [{ id: "s5", title: "Arrays and Strings", done: true }, { id: "s6", title: "Linked Lists", done: false }, { id: "s7", title: "Trees and Graphs", done: false }] },
  { id: "g3", type: "1month", title: "Run 5K without stopping", description: "Build up from 2K to 5K gradually", deadline: addDays(now, 20), priority: "Medium", category: "Health", progressStatus: "In Progress", progress: 50, subtasks: [{ id: "s8", title: "Week 1: 2K runs", done: true }, { id: "s9", title: "Week 2: 3K runs", done: true }, { id: "s10", title: "Week 3: 4K runs", done: false }, { id: "s11", title: "Week 4: 5K run", done: false }] },
  { id: "g4", type: "6month", title: "Build and ship a SaaS product", description: "Idea to paid users in 6 months", deadline: addDays(now, 170), priority: "High", category: "Work", progressStatus: "In Progress", progress: 20, subtasks: [{ id: "s12", title: "Validate idea with 10 users", done: true }, { id: "s13", title: "Build MVP", done: false }, { id: "s14", title: "Get first 5 paying customers", done: false }, { id: "s15", title: "Reach target MRR", done: false }] },
  { id: "g5", type: "6month", title: "Learn Spanish conversationally", description: "A2 to B1 level on CEFR scale", deadline: addDays(now, 160), priority: "Low", category: "Study", progressStatus: "Not Started", progress: 0, subtasks: [{ id: "s16", title: "Complete Duolingo 90-day streak", done: false }, { id: "s17", title: "Finish Pimsleur Level 1 and 2", done: false }, { id: "s18", title: "Have 10 conversations with native speakers", done: false }] },
  { id: "g6", type: "6month", title: "Build emergency fund", description: "6 months of expenses as financial reserve", deadline: addDays(now, 175), priority: "High", category: "Personal", progressStatus: "In Progress", progress: 40, subtasks: [{ id: "s19", title: "Cut unused subscriptions", done: true }, { id: "s20", title: "Automate monthly transfer", done: true }, { id: "s21", title: "Reach 50% milestone", done: false }, { id: "s22", title: "Reach 100% milestone", done: false }] },
];

const DEFAULT_HABITS = [
  { id: 1, name: "Morning Exercise", icon: "O", streak: 5, completedToday: false, history: [1, 1, 1, 0, 1, 1, 0] },
  { id: 2, name: "Read 30 mins", icon: "R", streak: 3, completedToday: false, history: [1, 1, 1, 1, 0, 1, 0] },
  { id: 3, name: "Meditate", icon: "M", streak: 2, completedToday: true, history: [0, 1, 1, 0, 1, 1, 1] },
  { id: 4, name: "Drink 2L Water", icon: "W", streak: 7, completedToday: false, history: [1, 1, 1, 1, 1, 1, 1] },
];

const SAMPLE_TASKS = [
  { id: 1, title: "Design system review", description: "Review Figma components", date: todayStr, startTime: "09:00", endTime: "10:30", priority: "High", category: "Work", status: "Pending", timeSpent: 0, running: false },
  { id: 2, title: "Read Chapter 5", description: "Deep Work by Cal Newport", date: todayStr, startTime: "11:00", endTime: "12:00", priority: "Medium", category: "Study", status: "Completed", timeSpent: 3720, running: false },
  { id: 3, title: "30 min Run", description: "", date: todayStr, startTime: "07:00", endTime: "07:30", priority: "Medium", category: "Health", status: "Completed", timeSpent: 1860, running: false },
  { id: 4, title: "Write API docs", description: "Document all endpoints", date: todayStr, startTime: "14:00", endTime: "16:00", priority: "High", category: "Work", status: "Pending", timeSpent: 900, running: false },
  { id: 5, title: "Weekly planning", description: "Set goals for next week", date: todayStr, startTime: "17:00", endTime: "17:30", priority: "Low", category: "Personal", status: "Pending", timeSpent: 0, running: false },
];

function formatTime(s) { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60; return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}` : `${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}`; }
function daysUntil(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }
function daysLabel(d) { const n = daysUntil(d); if (n < 0) return { text: `${Math.abs(n)}d overdue`, danger: true, warn: false }; if (n === 0) return { text: "Due today", danger: true, warn: false }; if (n <= 7) return { text: `${n}d left`, danger: false, warn: true }; return { text: `${n}d left`, danger: false, warn: false }; }

function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(task || { title: "", description: "", date: todayStr, startTime: "09:00", endTime: "10:00", priority: "Medium", category: "Work", status: "Pending" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          padding: "1.8rem",
          width: "min(500px, 92vw)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <span style={{ fontWeight: 500, fontSize: 16 }}>{task ? "Edit task" : "New task"}</span>
          <button
            onClick={onClose}
            style={{
              background: "#F3F4F6",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Task title" value={form.title} onChange={e => set("title", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} />
          <input placeholder="Description (optional)" value={form.description} onChange={e => set("description", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Start</label><input type="time" value={form.startTime} onChange={e => set("startTime", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>End</label><input type="time" value={form.endTime} onChange={e => set("endTime", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Priority</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></div>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <button
            onClick={() => {
              if (form.title.trim()) onSave(form);
            }}
            style={{
              background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
              color: "white",
              border: "none",
              borderRadius: 10,
              padding: "12px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 6px 20px rgba(99,102,241,0.3)",
            }}
            onMouseOver={e => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            {task ? "Save changes" : "Add task"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GoalModal({ goal, type, onSave, onClose }) {
  const defDl = type === "1month" ? addDays(now, 30) : addDays(now, 182);
  const [form, setForm] = useState(goal || { title: "", description: "", deadline: defDl, priority: "Medium", category: "Work", progressStatus: "Not Started", progress: 0, subtasks: [] });
  const [newSub, setNewSub] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  function addSub() { if (!newSub.trim()) return; set("subtasks", [...form.subtasks, { id: "s" + Date.now(), title: newSub.trim(), done: false }]); setNewSub(""); }
  function removeSub(id) { set("subtasks", form.subtasks.filter(s => s.id !== id)); }
  function toggleSub(id) { set("subtasks", form.subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s)); }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          padding: "1.8rem",
          width: "min(500px, 92vw)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <span style={{ fontWeight: 500, fontSize: 16 }}>{goal ? "Edit goal" : "New goal"} <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontWeight: 400 }}>({type === "1month" ? "1 Month" : "6 Month"})</span></span>
          <button
            onClick={onClose}
            style={{
              background: "#F3F4F6",
              border: "none",
              borderRadius: "50%",
              width: 30,
              height: 30,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Goal title" value={form.title} onChange={e => set("title", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} />
          <input placeholder="Description (optional)" value={form.description} onChange={e => set("description", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Deadline</label>
              <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Status</label>
              <select value={form.progressStatus} onChange={e => set("progressStatus", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }}>{PROGRESS_STATUSES.map(s => <option key={s}>{s}</option>)}</select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Priority</label>
              <select value={form.priority} onChange={e => set("priority", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }}>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></div>
            <div><label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} style={{ width: "100%", boxSizing: "border-box" }}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Progress — {form.progress}%</label>
            <input type="range" min="0" max="100" step="1" value={form.progress} onChange={e => set("progress", Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Subtasks / breakdown</div>
            {form.subtasks.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input type="checkbox" checked={s.done} onChange={() => toggleSub(s.id)} />
                <span style={{ flex: 1, fontSize: 13, textDecoration: s.done ? "line-through" : "none", color: s.done ? "var(--color-text-tertiary)" : "var(--color-text-primary)" }}>{s.title}</span>
                <button onClick={() => removeSub(s.id)} style={{ border: "none", background: "none", cursor: "pointer", color: "var(--color-text-tertiary)", fontSize: 13 }}>x</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input placeholder="Add subtask..." value={newSub} onChange={e => setNewSub(e.target.value)} onKeyDown={e => e.key === "Enter" && addSub()} style={{ flex: 1, boxSizing: "border-box" }} />
              <button onClick={addSub} style={{ padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 13, border: "0.5px solid var(--color-border-secondary)", background: "transparent", color: "var(--color-text-primary)" }}>Add</button>
            </div>
          </div>
          <button onClick={() => { if (form.title.trim()) onSave({ ...form, type }); }} style={{ background: "var(--color-text-primary)", color: "var(--color-background-primary)", border: "none", borderRadius: 8, padding: "10px", fontWeight: 500, cursor: "pointer", marginTop: 4 }}>{goal ? "Save changes" : "Add goal"}</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FocusMode({ task, timeSpent, running, onToggle, onStop, onExit }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--color-background-primary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 999, gap: "2rem" }}>
      <div style={{ position: "absolute", top: 20, right: 20 }}><button onClick={onExit} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 8 }}>Exit focus</button></div>
      <div style={{ fontSize: 12, letterSpacing: "0.1em", color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Focus mode</div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>{task.title}</div>
        {task.description && <div style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>{task.description}</div>}
      </div>
      <div style={{ fontSize: 64, fontWeight: 500, fontFamily: "var(--font-mono)", letterSpacing: "-2px" }}>{formatTime(timeSpent)}</div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onToggle} style={{ padding: "10px 28px", borderRadius: 10, fontWeight: 500, background: running ? "var(--color-background-warning)" : "var(--color-text-primary)", color: running ? "var(--color-text-warning)" : "var(--color-background-primary)", border: "none", cursor: "pointer", fontSize: 14 }}>{running ? "Pause" : "Resume"}</button>
        <button onClick={onStop} style={{ padding: "10px 28px", borderRadius: 10, fontWeight: 500, border: "0.5px solid var(--color-border-secondary)", cursor: "pointer", fontSize: 14, background: "none", color: "var(--color-text-primary)" }}>Stop</button>
      </div>
      <div style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>Stay focused. You got this.</div>
    </div>
  );
}

function GoalCard({ goal, onEdit, onDelete, onToggleComplete, onToggleSubtask, onUpdateProgress, onAddToToday }) {
  const [expanded, setExpanded] = useState(false);
  const dl = daysLabel(goal.deadline);
  const doneSubtasks = goal.subtasks.filter(s => s.done).length;
  const totalSubtasks = goal.subtasks.length;
  const isComplete = goal.progressStatus === "Completed";
  const barColor = goal.progress === 100 ? "#1D9E75" : goal.priority === "High" ? "#E24B4A" : "#7F77DD";
  return (
    <div style={{ background: "var(--color-background-primary)", borderRadius: 14, border: goal.priority === "High" && !isComplete ? "1px solid #F09595" : "0.5px solid var(--color-border-tertiary)", padding: "16px 18px", opacity: isComplete ? 0.72 : 1, transition: "all 0.2s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button onClick={() => onToggleComplete(goal.id)} style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 2, border: `2px solid ${isComplete ? "#1D9E75" : PRIORITY_COLORS[goal.priority]}`, background: isComplete ? "#1D9E75" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isComplete && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.5L4 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 5 }}>
            <span style={{ fontWeight: 500, fontSize: 14, textDecoration: isComplete ? "line-through" : "none" }}>{goal.title}</span>
            <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: PRIORITY_BG[goal.priority], color: PRIORITY_TEXT[goal.priority], fontWeight: 500 }}>{goal.priority}</span>
            <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: CAT_BG[goal.category] || "#F1EFE8", color: CAT_TEXT[goal.category] || "#5F5E5A" }}>{goal.category}</span>
            <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: STATUS_BG[goal.progressStatus], color: STATUS_TEXT[goal.progressStatus] }}>{goal.progressStatus}</span>
          </div>
          {goal.description && <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>{goal.description}</div>}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span style={{ color: "var(--color-text-secondary)" }}>{goal.progress}% complete</span>
              <span style={{ color: dl.danger ? "var(--color-text-danger)" : dl.warn ? "var(--color-text-warning)" : "var(--color-text-tertiary)" }}>{dl.text}</span>
            </div>
            <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${goal.progress}%`, background: barColor, borderRadius: 4, transition: "width 0.4s" }}></div>
            </div>
          </div>
          {totalSubtasks > 0 && <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{doneSubtasks}/{totalSubtasks} subtasks done</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => onEdit(goal)} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-tertiary)", fontSize: 13 }}>edit</button>
            <button onClick={() => onDelete(goal.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-text-tertiary)", fontSize: 13 }}>del</button>
          </div>
          <button onClick={() => setExpanded(e => !e)} style={{ padding: "4px 10px", borderRadius: 6, border: "0.5px solid var(--color-border-tertiary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 11 }}>{expanded ? "Collapse" : "Details"}</button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Adjust progress — {goal.progress}%</label>
            <input type="range" min="0" max="100" step="1" value={goal.progress} onChange={e => onUpdateProgress(goal.id, Number(e.target.value))} style={{ width: "100%" }} />
          </div>
          {totalSubtasks > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Subtasks</div>
              {goal.subtasks.map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  <input type="checkbox" checked={s.done} onChange={() => onToggleSubtask(goal.id, s.id)} />
                  <span style={{ flex: 1, fontSize: 13, textDecoration: s.done ? "line-through" : "none", color: s.done ? "var(--color-text-tertiary)" : "var(--color-text-primary)" }}>{s.title}</span>
                  <button onClick={() => onAddToToday({ title: s.title, description: "Subtask of: " + goal.title, category: goal.category, priority: goal.priority })} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>+ Today</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => onAddToToday({ title: goal.title, description: goal.description, category: goal.category, priority: goal.priority })} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", fontWeight: 500, color: "var(--color-text-primary)" }}>Add goal to today</button>
            <button onClick={() => onEdit(goal)} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "0.5px solid var(--color-border-tertiary)", background: "transparent", cursor: "pointer", color: "var(--color-text-secondary)" }}>Edit breakdown</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SmartPlannerPro() {
  const [view, setView] = useState("planner");
  const [goalTab, setGoalTab] = useState("1month");
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [goals, setGoals] = useState(SAMPLE_GOALS);
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [authPage, setAuthPage] = useState("login");
  const [focusTask, setFocusTask] = useState(null);
  const [xp, setXp] = useState(340);
  const [streak] = useState(6);
  const [toast, setToast] = useState(null);
  const [quote, setQuote] = useState("");
  const [time, setTime] = useState(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = useCallback((title, body) => {
    if (notificationsEnabled && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"
      });
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    const loadQuote = async () => {
      const q = await fetchAIQuote();
      setQuote(q);
    };

    loadQuote();

    const interval = setInterval(loadQuote, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setTasks(prevTasks => prevTasks.map(task => {
        const [hours, minutes] = task.startTime.split(":");
        const taskTime = new Date();
        taskTime.setHours(Number(hours));
        taskTime.setMinutes(Number(minutes));
        taskTime.setSeconds(0);

        const diff = taskTime - now;

        if (notificationsEnabled && diff > 0 && diff < 300000 && !task.notified) {
          sendNotification(
            "Upcoming Task ⏰",
            `${task.title} starts in 5 minutes`
          );

          return { ...task, notified: true };
        }

        return task;
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks, notificationsEnabled, sendNotification]);

  useEffect(() => {
    const interval = setInterval(() => { setTime(new Date()); }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  useEffect(() => {
    timerRef.current = setInterval(() => { setTasks(ts => ts.map(t => t.running ? { ...t, timeSpent: t.timeSpent + 1 } : t)); }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(null), 2800); }

  const totalTasks = tasks.length, completedTasks = tasks.filter(t => t.status === "Completed").length;
  const pendingTasks = totalTasks - completedTasks, totalTimeSpent = tasks.reduce((a, t) => a + t.timeSpent, 0);
  const productivityScore = Math.round((completedTasks / totalTasks) * 100);
  const level = xp < 200 ? "Beginner" : xp < 500 ? "Intermediate" : "Pro";
  const xpToNext = xp < 200 ? 200 : xp < 500 ? 500 : 1000;
  const runningTask = tasks.find(t => t.running);
  const sortedTasks = [...tasks].sort((a, b) => { const po = { High: 0, Medium: 1, Low: 2 }; return po[a.priority] - po[b.priority] || a.startTime.localeCompare(b.startTime); });
  const goals1m = goals.filter(g => g.type === "1month");
  const goals6m = goals.filter(g => g.type === "6month");
  const activeGoals = goalTab === "1month" ? goals1m : goals6m;
  const overallProgress = gs => gs.length ? Math.round(gs.reduce((a, g) => a + g.progress, 0) / gs.length) : 0;
  const highPriorityPending = tasks.filter(t => t.priority === "High" && t.status === "Pending").length;

  function toggleTimer(id) { setTasks(ts => ts.map(t => t.id !== id ? { ...t, running: false } : { ...t, running: !t.running })); }
  function stopTimer(id) { setTasks(ts => ts.map(t => t.id === id ? { ...t, running: false } : t)); setFocusTask(null); }
  function toggleComplete(id) { setTasks(ts => ts.map(t => { if (t.id !== id) return t; const c = t.status === "Pending"; if (c) setXp(x => x + 50); return { ...t, status: c ? "Completed" : "Pending", running: false }; })); }
  function deleteTask(id) { setTasks(ts => ts.filter(t => t.id !== id)); }
  function saveTask(form) { if (editTask) setTasks(ts => ts.map(t => t.id === editTask.id ? { ...t, ...form } : t)); else setTasks(ts => [...ts, { ...form, id: Date.now(), timeSpent: 0, running: false }]); setShowTaskModal(false); setEditTask(null); }
  function saveGoal(form) { if (editGoal) setGoals(gs => gs.map(g => g.id === editGoal.id ? { ...g, ...form } : g)); else setGoals(gs => [...gs, { ...form, id: "g" + Date.now() }]); setShowGoalModal(false); setEditGoal(null); }
  function deleteGoal(id) { setGoals(gs => gs.filter(g => g.id !== id)); }
  function toggleGoalComplete(id) { setGoals(gs => gs.map(g => { if (g.id !== id) return g; const c = g.progressStatus !== "Completed"; if (c) setXp(x => x + 100); return { ...g, progressStatus: c ? "Completed" : g.subtasks.length ? "In Progress" : "Not Started", progress: c ? 100 : g.progress }; })); }
  function toggleSubtask(gid, sid) { setGoals(gs => gs.map(g => { if (g.id !== gid) return g; const subs = g.subtasks.map(s => s.id === sid ? { ...s, done: !s.done } : s); const donePct = Math.round((subs.filter(s => s.done).length / subs.length) * 100); return { ...g, subtasks: subs, progress: donePct, progressStatus: donePct === 100 ? "Completed" : donePct > 0 ? "In Progress" : "Not Started" }; })); }
  function updateProgress(gid, val) { setGoals(gs => gs.map(g => g.id !== gid ? g : { ...g, progress: val, progressStatus: val === 100 ? "Completed" : val > 0 ? "In Progress" : "Not Started" })); }
  function addToToday(partial) { setTasks(ts => [...ts, { ...partial, id: Date.now(), date: todayStr, startTime: "09:00", endTime: "10:00", status: "Pending", timeSpent: 0, running: false, description: partial.description || "" }]); showToast('"' + partial.title + '" added to today'); setView("planner"); }
  function toggleHabit(id) { setHabits(hs => hs.map(h => { if (h.id !== id) return h; const d = !h.completedToday; if (d) setXp(x => x + 20); return { ...h, completedToday: d, streak: d ? h.streak + 1 : Math.max(0, h.streak - 1) }; })); }

  const focusTaskData = focusTask ? tasks.find(t => t.id === focusTask) : null;
  const navItems = [{ id: "planner", label: "Planner" }, { id: "goals", label: "Goals" }, { id: "habits", label: "Habits" }, { id: "analytics", label: "Analytics" }];

  const Btn = ({ children, onClick, style = {} }) => <button onClick={onClick} style={{ padding: "5px 10px", borderRadius: 7, border: "0.5px solid var(--color-border-secondary)", cursor: "pointer", fontSize: 11, fontWeight: 500, background: "transparent", color: "var(--color-text-secondary)", ...style }}>{children}</button>;

  if (!user) {
    return authPage === "login" ? (
      <Login
        onLogin={setUser}
        goToSignup={() => setAuthPage("signup")}
      />
    ) : (
      <Signup
        onSignup={() => setAuthPage("login")}
        goToLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)", paddingBottom: "5rem" }}>
      {focusTaskData && <FocusMode task={focusTaskData} timeSpent={focusTaskData.timeSpent} running={focusTaskData.running} onToggle={() => toggleTimer(focusTask)} onStop={() => stopTimer(focusTask)} onExit={() => setFocusTask(null)} />}
      {(showTaskModal || editTask) && <TaskModal task={editTask} onSave={saveTask} onClose={() => { setShowTaskModal(false); setEditTask(null); }} />}
      {(showGoalModal || editGoal) && <GoalModal goal={editGoal} type={goalTab} onSave={saveGoal} onClose={() => { setShowGoalModal(false); setEditGoal(null); }} />}
      {toast && <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "var(--color-text-primary)", color: "var(--color-background-primary)", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 2000, whiteSpace: "nowrap" }}>{toast}</div>}

      <div style={{ background: "var(--color-background-primary)", borderBottom: "0.5px solid var(--color-border-tertiary)", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 12,
            fontWeight: 600
          }}>
            F
          </div>

          <span style={{ fontWeight: 600, fontSize: 16 }}>
            Focus
          </span>
        </div>
        <nav style={{ display: "flex", gap: 2 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)} style={{ padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: view === n.id ? "var(--color-background-secondary)" : "transparent", color: view === n.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 5 }}>
              {n.label}
              {n.id === "goals" && goals.filter(g => g.progressStatus !== "Completed").length > 0 && <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 10, background: "#EEEDFE", color: "#3C3489" }}>{goals.filter(g => g.progressStatus !== "Completed").length}</span>}
            </button>
          ))}
        </nav>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          maxWidth: "60%"
        }}>

          {/* ⭐ MOTIVATION STRIP */}
          <motion.div
            key={quote}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
              border: "1px solid #C7D2FE",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 12,
              color: "#4338CA",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            ⭐ {quote}
          </motion.div>

          {/* ⏱ CLOCK */}
          <div style={{
            fontSize: 13,
            fontFamily: "monospace",
            color: "#6B7280"
          }}>
            ⏱ {formattedTime}
          </div>

          {/* USER */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#EEEDFE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 500
          }}>
            U
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
            }}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "white",
              cursor: "pointer",
              fontSize: 12
            }}
          >
            Logout
          </button>

        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {view === "planner" && <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 500 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>{streak > 0 && <span>🔥 {streak} day streak — </span>}{pendingTasks} tasks remaining</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  style={{ width: 14, height: 14 }}
                />
                Enable Notifications
              </label>
              <button onClick={() => { setEditTask(null); setShowTaskModal(true); }} style={{ padding: "8px 16px", borderRadius: 10, background: "var(--color-text-primary)", color: "var(--color-background-primary)", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>+ New task</button>
            </div>
          </div>
          <motion.div
            key={quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "linear-gradient(135deg, #EEF2FF, #E0E7FF)",
              border: "1px solid #C7D2FE",
              borderRadius: 14,
              padding: "14px 18px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: "0 6px 20px rgba(99,102,241,0.15)"
            }}
          >
            <div style={{
              fontSize: 18,
              background: "#6366F1",
              color: "white",
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              ⭐
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 12,
                color: "#6366F1",
                marginBottom: 2
              }}>
                Daily Motivation
              </div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                color: "#111827"
              }}>
                {quote}
              </div>
            </div>
          </motion.div>
          {runningTask && (
            <div style={{
              background: "radial-gradient(circle at top, #EEF2FF, #F9FAFB)",
              border: "1px solid #C7D2FE",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.2s ease"
            }}>
              <div>
                <div style={{ fontSize: 12, color: "#6366F1" }}>Currently Working</div>
                <div style={{ fontWeight: 500 }}>{runningTask.title}</div>
              </div>
              <div style={{ fontWeight: 600 }}>
                ⏱ {formatTime(runningTask.timeSpent)}
              </div>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 10, marginBottom: "1.25rem" }}>
            {[{ label: "Total", value: totalTasks }, { label: "Completed", value: completedTasks, color: "var(--color-text-success)" }, { label: "Pending", value: pendingTasks }, { label: "Time today", value: formatTime(totalTimeSpent) }].map(s => (
              <div key={s.label}
                style={{ background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 0 2px rgba(99,102,241,0.3), 0 10px 25px rgba(0,0,0,0.08)", transition: "all 0.2s ease" }}
                onMouseOver={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 500, color: s.color || "var(--color-text-primary)" }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
              <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="22" fill="none" stroke="var(--color-border-tertiary)" strokeWidth="5" /><circle cx="28" cy="28" r="22" fill="none" stroke="#639922" strokeWidth="5" strokeDasharray={`${(productivityScore / 100) * 138.2} 138.2`} strokeLinecap="round" transform="rotate(-90 28 28)" /></svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500 }}>{productivityScore}%</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Productivity score</div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{productivityScore >= 70 ? "You're having a great day!" : productivityScore >= 40 ? "Good progress, keep going." : "Let's get started on those tasks."}</div>
              {highPriorityPending >= 3 && <div style={{ fontSize: 12, color: "var(--color-text-warning)", marginTop: 6 }}>⚠ {highPriorityPending} high-priority tasks pending — consider rescheduling some.</div>}
            </div>
            {runningTask && <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, border: "1px solid var(--color-border-warning)", background: "var(--color-background-warning)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--color-text-warning)", animation: "pulse 1s infinite" }}></div>
              <div><div style={{ fontSize: 11, color: "var(--color-text-warning)" }}>Running</div><div style={{ fontSize: 13, fontWeight: 500, fontFamily: "var(--font-mono)" }}>{formatTime(runningTask.timeSpent)}</div></div>
            </div>}
          </div>
          <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "12px 1.25rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 500, minWidth: 80 }}>{level}</span>
            <div style={{ flex: 1, height: 6, background: "var(--color-background-secondary)", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min((xp / xpToNext) * 100, 100)}%`, background: "#7F77DD", borderRadius: 4, transition: "width 0.4s" }}></div></div>
            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", minWidth: 80, textAlign: "right" }}>{xp} / {xpToNext} XP</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sortedTasks.map(task => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 12,
                  padding: 16,
                  borderLeft: `5px solid ${PRIORITY_COLORS[task.priority]}`,
                  boxShadow: task.running
                    ? "0 0 20px rgba(245,158,11,0.3)"
                    : "0 4px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <button onClick={() => toggleComplete(task.id)} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${task.status === "Completed" ? "#639922" : PRIORITY_COLORS[task.priority]}`, background: task.status === "Completed" ? "#639922" : "transparent", cursor: "pointer", flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {task.status === "Completed" && <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                      <span style={{ fontWeight: 500, fontSize: 14, textDecoration: task.status === "Completed" ? "line-through" : "none" }}>{task.title}</span>
                      <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: PRIORITY_BG[task.priority], color: PRIORITY_TEXT[task.priority], fontWeight: 500 }}>{task.priority}</span>
                      <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: CAT_BG[task.category] || "#F1EFE8", color: CAT_TEXT[task.category] || "#5F5E5A" }}>{task.category}</span>
                    </div>
                    {task.description && <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 4 }}>{task.description}</div>}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{task.startTime} – {task.endTime}</span>
                      {task.timeSpent > 0 && <span style={{ fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>⏱ {formatTime(task.timeSpent)}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    {task.status !== "Completed" && <>
                      <Btn onClick={() => toggleTimer(task.id)} style={task.running ? { background: "var(--color-background-warning)", color: "var(--color-text-warning)" } : { }}>{task.running ? "Pause" : "Start"}</Btn>
                      {task.running && <><Btn onClick={() => stopTimer(task.id)}>Stop</Btn><Btn onClick={() => setFocusTask(task.id)}>Focus</Btn></>}
                    </>}
                    <button onClick={() => { setEditTask(task); setShowTaskModal(true); }} style={{ padding: "5px 8px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, background: "transparent", color: "var(--color-text-tertiary)" }}>edit</button>
                    <button onClick={() => deleteTask(task.id)} style={{ padding: "5px 8px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, background: "transparent", color: "var(--color-text-tertiary)" }}>del</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>}

      {view === "goals" && <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>Future Goals Planner</div>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>Turn long-term ambitions into daily actions</div>
          </div>
          <button onClick={() => { setEditGoal(null); setShowGoalModal(true); }} style={{ padding: "8px 16px", borderRadius: 10, background: "var(--color-text-primary)", color: "var(--color-background-primary)", border: "none", cursor: "pointer", fontWeight: 500, fontSize: 13 }}>+ New goal</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10, marginBottom: "1.25rem" }}>
          {[{ label: "1 Month Goals", gs: goals1m, color: "#7F77DD", bg: "#EEEDFE", tc: "#3C3489" }, { label: "6 Month Goals", gs: goals6m, color: "#378ADD", bg: "#E6F1FB", tc: "#0C447C" }].map(({ label, gs, color, bg, tc }) => (
            <div key={label} style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1rem 1.25rem" }}>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 6 }}>{label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 24, fontWeight: 500 }}>{overallProgress(gs)}%</span>
                <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>avg progress</span>
              </div>
              <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}><div style={{ height: "100%", width: `${overallProgress(gs)}%`, background: color, borderRadius: 4, transition: "width 0.5s" }}></div></div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: bg, color: tc }}>{gs.filter(g => g.progressStatus === "Completed").length} done</span>
                <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{gs.filter(g => g.progressStatus !== "Completed").length} active</span>
              </div>
            </div>
          ))}
        </div>

        {activeGoals.filter(g => g.priority === "High" && g.progressStatus !== "Completed").length >= 3 && (
          <div style={{ background: "#FAEEDA", border: "0.5px solid #FAC775", borderRadius: 10, padding: "10px 14px", marginBottom: "1.25rem", fontSize: 13, color: "#633806", display: "flex", gap: 8 }}>
            <span style={{ flexShrink: 0 }}>⚠</span>
            <span>{activeGoals.filter(g => g.priority === "High" && g.progressStatus !== "Completed").length} high-priority goals active — consider breaking them into smaller milestones.</span>
          </div>
        )}

        {activeGoals.filter(g => daysUntil(g.deadline) <= 7 && g.progressStatus !== "Completed").length > 0 && (
          <div style={{ background: "#FCEBEB", border: "0.5px solid #F09595", borderRadius: 10, padding: "10px 14px", marginBottom: "1.25rem", fontSize: 13, color: "#791F1F", display: "flex", gap: 8 }}>
            <span style={{ flexShrink: 0 }}>⏰</span>
            <span>{activeGoals.filter(g => daysUntil(g.deadline) <= 7 && g.progressStatus !== "Completed").length} goal(s) due within 7 days — {activeGoals.filter(g => daysUntil(g.deadline) <= 7 && g.progressStatus !== "Completed").map(g => g.title).join(", ")}.</span>
          </div>
        )}

        <div style={{ display: "flex", gap: 4, marginBottom: "1.25rem", background: "var(--color-background-secondary)", padding: 4, borderRadius: 10, width: "fit-content" }}>
          {[{ id: "1month", label: "1 Month Goals", count: goals1m.length }, { id: "6month", label: "6 Month Goals", count: goals6m.length }].map(t => (
            <button key={t.id} onClick={() => setGoalTab(t.id)} style={{ padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: goalTab === t.id ? "var(--color-background-primary)" : "transparent", color: goalTab === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
              {t.label} <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 8, background: goalTab === t.id ? "#EEEDFE" : "transparent", color: "#3C3489" }}>{t.count}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, marginBottom: "1.25rem" }}>
          {[{ label: "Completed", value: activeGoals.filter(g => g.progressStatus === "Completed").length }, { label: "In progress", value: activeGoals.filter(g => g.progressStatus === "In Progress").length }, { label: "Not started", value: activeGoals.filter(g => g.progressStatus === "Not Started").length }].map(s => (
            <div key={s.label}
              style={{ background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 0 2px rgba(99,102,241,0.3), 0 10px 25px rgba(0,0,0,0.08)", transition: "all 0.2s ease" }}
              onMouseOver={e => (e.currentTarget.style.transform = "translateY(-3px)")}
              onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 3 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 500 }}>{s.value}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--color-text-tertiary)" }}>/{activeGoals.length}</span></div>
            </div>
          ))}
        </div>

        {activeGoals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--color-text-secondary)", fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>O</div>
            No {goalTab === "1month" ? "1-month" : "6-month"} goals yet.
            <div style={{ marginTop: 14 }}><button onClick={() => setShowGoalModal(true)} style={{ padding: "8px 20px", borderRadius: 10, border: "0.5px solid var(--color-border-secondary)", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Add your first goal</button></div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeGoals.sort((a, b) => { const po = { High: 0, Medium: 1, Low: 2 }; return po[a.priority] - po[b.priority]; }).map(goal => (
              <GoalCard key={goal.id} goal={goal} onEdit={g => { setEditGoal(g); setShowGoalModal(true); }} onDelete={deleteGoal} onToggleComplete={toggleGoalComplete} onToggleSubtask={toggleSubtask} onUpdateProgress={updateProgress} onAddToToday={addToToday} />
            ))}
          </div>
        )}
      </>}

      {view === "habits" && <>
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ fontSize: 20, fontWeight: 500 }}>Habit tracker</div>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 2 }}>Build consistency, one day at a time</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {habits.map(h => (
            <div key={h.id} style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => toggleHabit(h.id)} style={{ width: 36, height: 36, borderRadius: 10, border: `1.5px solid ${h.completedToday ? "#1D9E75" : "var(--color-border-secondary)"}`, background: h.completedToday ? "#E1F5EE" : "transparent", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: h.completedToday ? "#1D9E75" : "var(--color-text-secondary)" }}>{h.completedToday ? "✓" : h.icon}</button>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{h.name}</span>
                    <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>🔥 {h.streak} day streak</span>
                    {h.completedToday && <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: "#E1F5EE", color: "#085041", fontWeight: 500 }}>Done today</span>}
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: h.history[i] ? "#1D9E75" : "var(--color-background-secondary)", marginBottom: 3 }}></div>
                        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "1.5rem", background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1.25rem" }}>
          <div style={{ fontWeight: 500, marginBottom: "1rem" }}>Your progress</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 10 }}>
            {[{ label: "Total XP", value: xp }, { label: "Day streak", value: streak }, { label: "Level", value: level }].map(s => (
              <div key={s.label}
                style={{ background: "white", borderRadius: 12, padding: "14px 16px", boxShadow: "0 0 0 2px rgba(99,102,241,0.3), 0 10px 25px rgba(0,0,0,0.08)", transition: "all 0.2s ease", textAlign: "center" }}
                onMouseOver={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ fontSize: 22, fontWeight: 500 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {view === "analytics" && <>
        <div style={{ fontSize: 20, fontWeight: 500, marginBottom: "1.25rem" }}>Analytics</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12, marginBottom: "1.25rem" }}>
          <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1.25rem" }}>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 8 }}>Task completion rate</div>
            <div style={{ fontSize: 28, fontWeight: 500 }}>{productivityScore}%</div>
            <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 4, marginTop: 10, overflow: "hidden" }}><div style={{ height: "100%", width: `${productivityScore}%`, background: "#639922", borderRadius: 4 }}></div></div>
          </div>
          <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1.25rem" }}>
            <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 8 }}>Goals avg progress</div>
            <div style={{ fontSize: 28, fontWeight: 500 }}>{overallProgress(goals)}%</div>
            <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 4, marginTop: 10, overflow: "hidden" }}><div style={{ height: "100%", width: `${overallProgress(goals)}%`, background: "#7F77DD", borderRadius: 4 }}></div></div>
          </div>
        </div>
        <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 500, marginBottom: "1rem" }}>Goal progress by category</div>
          {CATEGORIES.map(cat => {
            const gs = goals.filter(g => g.category === cat); if (!gs.length) return null; const avg = Math.round(gs.reduce((a, g) => a + g.progress, 0) / gs.length); return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{cat}</span><span style={{ color: "var(--color-text-secondary)" }}>{avg}% avg — {gs.length} goal{gs.length !== 1 ? "s" : ""}</span></div>
                <div style={{ height: 7, background: "var(--color-background-secondary)", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${avg}%`, background: CAT_COLORS[cat], borderRadius: 4, transition: "width 0.5s" }}></div></div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1.25rem", marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 500, marginBottom: "1rem" }}>Time tracked today by category</div>
          {CATEGORIES.map(cat => {
            const catTime = tasks.filter(t => t.category === cat).reduce((a, t) => a + t.timeSpent, 0); const pct = totalTimeSpent > 0 ? Math.round((catTime / totalTimeSpent) * 100) : 0; return (
              <div key={cat} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}><span>{cat}</span><span style={{ color: "var(--color-text-secondary)" }}>{formatTime(catTime)} — {pct}%</span></div>
                <div style={{ height: 7, background: "var(--color-background-secondary)", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: `${pct}%`, background: CAT_COLORS[cat], borderRadius: 4 }}></div></div>
              </div>
            );
          })}
        </div>
        <div style={{ background: "var(--color-background-primary)", borderRadius: 12, border: "0.5px solid var(--color-border-tertiary)", padding: "1.25rem" }}>
          <div style={{ fontWeight: 500, marginBottom: "1rem" }}>Smart insights</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { text: "Your most productive category today is Work — 2 tasks completed." },
              { text: `${goals.filter(g => daysUntil(g.deadline) <= 7 && g.progressStatus !== "Completed").length} goal(s) due within 7 days — check your Goals page.` },
              { text: `You are on a ${streak}-day streak. Keep going.` },
              { text: `${goals.filter(g => g.progressStatus === "Not Started").length} goal(s) not yet started — break them into subtasks to begin.` },
            ].map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "var(--color-background-secondary)", borderRadius: 8 }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>
      </>}
    </div>

      {
    (view === "planner" || view === "goals") && (
      <button
        onClick={() => { if (view === "goals") { setEditGoal(null); setShowGoalModal(true); } else { setEditTask(null); setShowTaskModal(true); } }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
          color: "white",
          fontSize: 26,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 12px 30px rgba(99,102,241,0.4)",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        +
      </button>
    )
  }
  <style>{"@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}"}</style>
    </div >
  );
}