'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, CheckCircle2, Circle, ArrowRight, ArrowLeft, 
  Sparkles, Layers, RefreshCw, Edit2, Check, X,
  Clock, CheckCheck, Palette
} from 'lucide-react';

const AVAILABLE_COLORS = [
  'emerald', 'blue', 'purple', 'amber', 'rose', 'cyan', 'indigo', 'orange', 'fuchsia', 'teal'
];

const INITIAL_LANES = [
  { id: 'lane-1', title: 'Work & Projects', color: 'emerald', badge: 'Lane 1' },
  { id: 'lane-2', title: 'Personal & Habits', color: 'blue', badge: 'Lane 2' },
  { id: 'lane-3', title: 'Research & Ideas', color: 'purple', badge: 'Lane 3' },
  { id: 'lane-4', title: 'Urgent & Quick Wins', color: 'amber', badge: 'Lane 4' },
];

const COLOR_CLASSES = {
  emerald: {
    border: 'border-emerald-500/30 focus-within:border-emerald-500/60',
    header: 'from-emerald-500/10 to-transparent text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    dot: 'bg-emerald-500',
    indicator: 'bg-emerald-500/20 text-emerald-300'
  },
  blue: {
    border: 'border-blue-500/30 focus-within:border-blue-500/60',
    header: 'from-blue-500/10 to-transparent text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    button: 'bg-blue-600 hover:bg-blue-500 text-white',
    dot: 'bg-blue-500',
    indicator: 'bg-blue-500/20 text-blue-300'
  },
  purple: {
    border: 'border-purple-500/30 focus-within:border-purple-500/60',
    header: 'from-purple-500/10 to-transparent text-purple-400',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    button: 'bg-purple-600 hover:bg-purple-500 text-white',
    dot: 'bg-purple-500',
    indicator: 'bg-purple-500/20 text-purple-300'
  },
  amber: {
    border: 'border-amber-500/30 focus-within:border-amber-500/60',
    header: 'from-amber-500/10 to-transparent text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    button: 'bg-amber-600 hover:bg-amber-500 text-white',
    dot: 'bg-amber-500',
    indicator: 'bg-amber-500/20 text-amber-300'
  },
  rose: {
    border: 'border-rose-500/30 focus-within:border-rose-500/60',
    header: 'from-rose-500/10 to-transparent text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    button: 'bg-rose-600 hover:bg-rose-500 text-white',
    dot: 'bg-rose-500',
    indicator: 'bg-rose-500/20 text-rose-300'
  },
  cyan: {
    border: 'border-cyan-500/30 focus-within:border-cyan-500/60',
    header: 'from-cyan-500/10 to-transparent text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    button: 'bg-cyan-600 hover:bg-cyan-500 text-white',
    dot: 'bg-cyan-500',
    indicator: 'bg-cyan-500/20 text-cyan-300'
  },
  indigo: {
    border: 'border-indigo-500/30 focus-within:border-indigo-500/60',
    header: 'from-indigo-500/10 to-transparent text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    dot: 'bg-indigo-500',
    indicator: 'bg-indigo-500/20 text-indigo-300'
  },
  orange: {
    border: 'border-orange-500/30 focus-within:border-orange-500/60',
    header: 'from-orange-500/10 to-transparent text-orange-400',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    button: 'bg-orange-600 hover:bg-orange-500 text-white',
    dot: 'bg-orange-500',
    indicator: 'bg-orange-500/20 text-orange-300'
  },
  fuchsia: {
    border: 'border-fuchsia-500/30 focus-within:border-fuchsia-500/60',
    header: 'from-fuchsia-500/10 to-transparent text-fuchsia-400',
    badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    button: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white',
    dot: 'bg-fuchsia-500',
    indicator: 'bg-fuchsia-500/20 text-fuchsia-300'
  },
  teal: {
    border: 'border-teal-500/30 focus-within:border-teal-500/60',
    header: 'from-teal-500/10 to-transparent text-teal-400',
    badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    button: 'bg-teal-600 hover:bg-teal-500 text-white',
    dot: 'bg-teal-500',
    indicator: 'bg-teal-500/20 text-teal-300'
  }
};

export default function ParallelTodoApp() {
  const [lanes, setLanes] = useState(INITIAL_LANES);
  const [tasks, setTasks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState({});

  // Lane editing state
  const [editingTitleLaneId, setEditingTitleLaneId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [editingLaneColor, setEditingLaneColor] = useState('emerald');

  // Task editing state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  // Add Lane state
  const [isAddingLane, setIsAddingLane] = useState(false);
  const [newLaneTitle, setNewLaneTitle] = useState('');
  const [newLaneColor, setNewLaneColor] = useState('rose');

  const lanesContainerRef = useRef(null);
  const newLaneInputRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('quadtrack_tasks');
      const savedLanes = localStorage.getItem('quadtrack_lanes');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        setTasks([
          { id: '1', laneId: 'lane-1', text: 'Define project architecture & roadmap', done: false, createdAt: Date.now() },
          { id: '2', laneId: 'lane-2', text: 'Morning workout & hydration', done: true, createdAt: Date.now() - 3600000 },
          { id: '3', laneId: 'lane-3', text: 'Evaluate LLM parallel reasoning models', done: false, createdAt: Date.now() - 7200000 },
          { id: '4', laneId: 'lane-4', text: 'Quick deployment check & DNS verify', done: false, createdAt: Date.now() - 1800000 }
        ]);
      }
      if (savedLanes) {
        const parsedLanes = JSON.parse(savedLanes);
        if (Array.isArray(parsedLanes) && parsedLanes.length > 0) {
          setLanes(parsedLanes);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('quadtrack_tasks', JSON.stringify(tasks));
      localStorage.setItem('quadtrack_lanes', JSON.stringify(lanes));
    } catch (e) {
      console.error(e);
    }
  }, [tasks, lanes, mounted]);

  // Focus add lane input when toggled
  useEffect(() => {
    if (isAddingLane) {
      setTimeout(() => {
        if (newLaneInputRef.current) {
          newLaneInputRef.current.focus();
        }
        if (lanesContainerRef.current) {
          lanesContainerRef.current.scrollTo({
            left: lanesContainerRef.current.scrollWidth,
            behavior: 'smooth'
          });
        }
      }, 50);
    }
  }, [isAddingLane]);

  // Add a new lane
  const createLane = () => {
    const title = newLaneTitle.trim();
    if (!title) return;

    const newLaneId = `lane-${Date.now()}`;
    const newLane = {
      id: newLaneId,
      title,
      color: newLaneColor,
      badge: `Lane ${lanes.length + 1}`
    };

    setLanes(prev => [...prev, newLane]);
    setNewLaneTitle('');

    // Advance default color to next available
    const nextIdx = (AVAILABLE_COLORS.indexOf(newLaneColor) + 1) % AVAILABLE_COLORS.length;
    setNewLaneColor(AVAILABLE_COLORS[nextIdx]);
    setIsAddingLane(false);

    // Scroll to new lane
    setTimeout(() => {
      if (lanesContainerRef.current) {
        lanesContainerRef.current.scrollTo({
          left: lanesContainerRef.current.scrollWidth,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Delete a lane
  const deleteLane = (laneId) => {
    if (lanes.length <= 1) {
      alert("You need at least one lane.");
      return;
    }
    const targetLane = lanes.find(l => l.id === laneId);
    if (!targetLane) return;

    const laneTaskCount = tasks.filter(t => t.laneId === laneId).length;
    const confirmMsg = laneTaskCount > 0 
      ? `Delete lane "${targetLane.title}" and its ${laneTaskCount} task${laneTaskCount > 1 ? 's' : ''}?`
      : `Delete lane "${targetLane.title}"?`;

    if (window.confirm(confirmMsg)) {
      setLanes(prev => prev.filter(l => l.id !== laneId));
      setTasks(prev => prev.filter(t => t.laneId !== laneId));
    }
  };

  // Reorder lanes
  const moveLane = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= lanes.length) return;
    const newLanes = [...lanes];
    const temp = newLanes[index];
    newLanes[index] = newLanes[targetIndex];
    newLanes[targetIndex] = temp;
    setLanes(newLanes);
  };

  const addTask = (laneId) => {
    const text = (inputs[laneId] || '').trim();
    if (!text) return;
    const newTask = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      laneId,
      text,
      done: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
    setInputs(prev => ({ ...prev, [laneId]: '' }));
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const moveTask = (id, direction) => {
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;
    const currentIndex = lanes.findIndex(l => l.id === currentTask.laneId);
    let targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= lanes.length) return;
    const targetLane = lanes[targetIndex];
    setTasks(prev => prev.map(t => t.id === id ? { ...t, laneId: targetLane.id } : t));
  };

  const startEditLane = (lane) => {
    setEditingTitleLaneId(lane.id);
    setEditingTitleText(lane.title);
    setEditingLaneColor(lane.color || 'emerald');
  };

  const saveEditLane = () => {
    if (editingTitleText.trim()) {
      setLanes(prev => prev.map(l => l.id === editingTitleLaneId ? { 
        ...l, 
        title: editingTitleText.trim(),
        color: editingLaneColor
      } : l));
    }
    setEditingTitleLaneId(null);
  };

  const startEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const saveEditTask = () => {
    if (editingTaskText.trim()) {
      setTasks(prev => prev.map(t => t.id === editingTaskId ? { ...t, text: editingTaskText.trim() } : t));
    }
    setEditingTaskId(null);
  };

  const clearLane = (laneId) => {
    if (confirm('Clear completed tasks in this lane?')) {
      setTasks(prev => prev.filter(t => !(t.laneId === laneId && t.done)));
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.done).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!mounted) {
    return <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-[#0f1523]/80 backdrop-blur sticky top-0 z-30 px-4 lg:px-8 py-3.5">
        <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">QuadTrack</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {lanes.length} {lanes.length === 1 ? 'Lane' : 'Parallel Lanes'}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Dynamic multi-stream parallel task board with instant local persistence</p>
            </div>
          </div>

          {/* Action & Stats Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingLane(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lane</span>
            </button>

            <div className="flex items-center gap-3 sm:gap-5 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <div className="text-xs">
                  <span className="text-slate-400">Active: </span>
                  <span className="font-semibold text-slate-200">{totalTasks - completedTasks}</span>
                </div>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <CheckCheck className="w-4 h-4 text-emerald-400" />
                <div className="text-xs">
                  <span className="text-slate-400">Done: </span>
                  <span className="font-semibold text-slate-200">{completedTasks}</span>
                </div>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-2">
                <div className="w-14 sm:w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-300">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Multi-Lane Horizontal Scrolling Board */}
      <main 
        ref={lanesContainerRef}
        className="flex-1 p-4 lg:p-6 w-full overflow-x-auto"
      >
        <div className="flex items-start gap-5 min-w-max pb-6">
          {lanes.map((lane, idx) => {
            const laneTasks = tasks.filter(t => t.laneId === lane.id);
            const doneCount = laneTasks.filter(t => t.done).length;
            const theme = COLOR_CLASSES[lane.color] || COLOR_CLASSES.emerald;

            return (
              <div 
                key={lane.id}
                className="w-[320px] sm:w-[350px] shrink-0 flex flex-col bg-[#111726] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl shadow-black/40 transition-all duration-200 hover:border-slate-700/80"
              >
                {/* Lane Header */}
                <div className={`p-4 border-b border-slate-800/80 bg-gradient-to-b ${theme.header}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                      {lane.badge || `Lane ${idx + 1}`}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-slate-400 mr-1">
                        {doneCount}/{laneTasks.length} done
                      </span>
                      {doneCount > 0 && (
                        <button
                          onClick={() => clearLane(lane.id)}
                          title="Clear completed tasks"
                          className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx > 0 && (
                        <button
                          onClick={() => moveLane(idx, -1)}
                          title="Move lane left"
                          className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800/80 transition"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < lanes.length - 1 && (
                        <button
                          onClick={() => moveLane(idx, 1)}
                          title="Move lane right"
                          className="p-1 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800/80 transition"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteLane(lane.id)}
                        title="Delete lane"
                        className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800/80 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {editingTitleLaneId === lane.id ? (
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={editingTitleText}
                          onChange={(e) => setEditingTitleText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEditLane();
                            if (e.key === 'Escape') setEditingTitleLaneId(null);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-700 px-2.5 py-1 text-sm rounded-lg text-white outline-none focus:border-indigo-500"
                          autoFocus
                        />
                        <button onClick={saveEditLane} className="p-1 text-emerald-400 hover:bg-slate-800 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingTitleLaneId(null)} className="p-1 text-rose-400 hover:bg-slate-800 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">Color:</span>
                        {AVAILABLE_COLORS.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditingLaneColor(c)}
                            className={`w-3.5 h-3.5 rounded-full transition-all ${COLOR_CLASSES[c]?.dot || 'bg-slate-500'} ${
                              editingLaneColor === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900 scale-125' : 'opacity-60 hover:opacity-100'
                            }`}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <h2 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${theme.dot}`} />
                        {lane.title}
                      </h2>
                      <button 
                        onClick={() => startEditLane(lane)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition"
                        title="Edit Lane Title & Color"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Add Task Bar */}
                <div className="p-3 border-b border-slate-800/60 bg-[#0e1422]">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      addTask(lane.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder={`+ Add task to ${lane.title}...`}
                      value={inputs[lane.id] || ''}
                      onChange={(e) => setInputs({ ...inputs, [lane.id]: e.target.value })}
                      className="flex-1 bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 rounded-xl px-3 py-2 outline-none focus:border-slate-600 transition"
                    />
                    <button
                      type="submit"
                      disabled={!(inputs[lane.id] || '').trim()}
                      className={`p-2 rounded-xl text-xs font-medium transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed ${theme.button}`}
                      title="Add Task"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* Task List */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 max-h-[calc(100vh-270px)] min-h-[320px]">
                  {laneTasks.length === 0 ? (
                    <div className="h-44 border-2 border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs gap-1.5 p-4 text-center">
                      <Sparkles className="w-5 h-5 text-slate-600 mb-1" />
                      <span>No tasks in this lane</span>
                      <span className="text-[11px] text-slate-600">Type above or press Enter to add</span>
                    </div>
                  ) : (
                    laneTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group relative rounded-xl border p-3 transition-all duration-150 ${
                          task.done 
                            ? 'bg-slate-900/40 border-slate-800/50 opacity-60' 
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:shadow-md'
                        }`}
                      >
                        {editingTaskId === task.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingTaskText}
                              onChange={(e) => setEditingTaskText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditTask();
                                if (e.key === 'Escape') setEditingTaskId(null);
                              }}
                              className="flex-1 bg-slate-800 border border-slate-700 px-2.5 py-1 text-sm rounded-lg text-white outline-none focus:border-indigo-500"
                              autoFocus
                            />
                            <button onClick={saveEditTask} className="p-1 text-emerald-400 hover:bg-slate-800 rounded">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingTaskId(null)} className="p-1 text-rose-400 hover:bg-slate-800 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-2.5">
                            <button 
                              onClick={() => toggleTask(task.id)}
                              className="mt-0.5 text-slate-400 hover:text-emerald-400 transition shrink-0"
                            >
                              {task.done ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Circle className="w-4 h-4 hover:border-emerald-400" />
                              )}
                            </button>

                            <span 
                              onClick={() => toggleTask(task.id)}
                              className={`flex-1 text-sm leading-relaxed cursor-pointer break-words ${
                                task.done ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            >
                              {task.text}
                            </span>

                            {/* Actions on hover */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {idx > 0 && (
                                <button
                                  onClick={() => moveTask(task.id, -1)}
                                  title={`Move to ${lanes[idx - 1]?.title || 'left lane'}`}
                                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {idx < lanes.length - 1 && (
                                <button
                                  onClick={() => moveTask(task.id, 1)}
                                  title={`Move to ${lanes[idx + 1]?.title || 'right lane'}`}
                                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => startEditTask(task)}
                                title="Edit task"
                                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteTask(task.id)}
                                title="Delete task"
                                className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Lane Card / Inline Form */}
          {isAddingLane ? (
            <div className="w-[320px] sm:w-[350px] shrink-0 bg-[#111726] border border-indigo-500/50 rounded-2xl p-4 shadow-xl flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  New Parallel Lane
                </span>
                <button 
                  onClick={() => setIsAddingLane(false)}
                  className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5">Lane Title</label>
                <input
                  ref={newLaneInputRef}
                  type="text"
                  placeholder="e.g. Backlog, Marketing, Testing..."
                  value={newLaneTitle}
                  onChange={(e) => setNewLaneTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createLane();
                    if (e.key === 'Escape') setIsAddingLane(false);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5">Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewLaneColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform ${COLOR_CLASSES[c]?.dot || 'bg-slate-500'} ${
                        newLaneColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-65 hover:opacity-100'
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={createLane}
                  disabled={!newLaneTitle.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  Create Lane
                </button>
                <button
                  onClick={() => setIsAddingLane(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingLane(true)}
              className="w-[320px] sm:w-[350px] shrink-0 min-h-[380px] border-2 border-dashed border-slate-800 hover:border-slate-700 hover:bg-slate-900/30 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-slate-400 hover:text-white transition group p-6"
            >
              <div className="p-3.5 rounded-2xl bg-slate-800/80 group-hover:bg-indigo-600/20 text-slate-400 group-hover:text-indigo-400 transition">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white">Add Another Lane</span>
              <span className="text-xs text-slate-500 text-center max-w-[220px]">Create an additional parallel stream with a custom title & color</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
