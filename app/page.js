'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, Trash2, CheckCircle2, Circle, ArrowRight, ArrowLeft, 
  Sparkles, Layers, RefreshCw, Edit2, Check, X, ShieldAlert,
  Flame, Clock, CheckCheck
} from 'lucide-react';

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
  }
};

export default function ParallelTodoApp() {
  const [lanes, setLanes] = useState(INITIAL_LANES);
  const [tasks, setTasks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [inputs, setInputs] = useState({
    'lane-1': '',
    'lane-2': '',
    'lane-3': '',
    'lane-4': ''
  });
  const [editingTitleLaneId, setEditingTitleLaneId] = useState(null);
  const [editingTitleText, setEditingTitleText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

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
        setLanes(JSON.parse(savedLanes));
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
  };

  const saveEditLane = () => {
    if (editingTitleText.trim()) {
      setLanes(prev => prev.map(l => l.id === editingTitleLaneId ? { ...l, title: editingTitleText.trim() } : l));
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
        <div className="max-w-[1800px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">QuadTrack</h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">4 Parallel Streams</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Seamless parallel to-do system with instant additions & local persistence</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2">
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
              <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-300">{progressPercent}%</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main 4-Column Board */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1800px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 h-full">
          {lanes.map((lane, idx) => {
            const laneTasks = tasks.filter(t => t.laneId === lane.id);
            const doneCount = laneTasks.filter(t => t.done).length;
            const theme = COLOR_CLASSES[lane.color] || COLOR_CLASSES.emerald;

            return (
              <div 
                key={lane.id}
                className="flex flex-col bg-[#111726] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl shadow-black/40 transition-all duration-200 hover:border-slate-700/80"
              >
                {/* Lane Header */}
                <div className={`p-4 border-b border-slate-800/80 bg-gradient-to-b ${theme.header}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                      {lane.badge}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-slate-400">
                        {doneCount}/{laneTasks.length} done
                      </span>
                      {doneCount > 0 && (
                        <button
                          onClick={() => clearLane(lane.id)}
                          title="Clear done tasks"
                          className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800 transition"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {editingTitleLaneId === lane.id ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        value={editingTitleText}
                        onChange={(e) => setEditingTitleText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditLane()}
                        className="flex-1 bg-slate-900 border border-slate-700 px-2 py-1 text-sm rounded-lg text-white outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <button onClick={saveEditLane} className="p-1 text-emerald-400 hover:bg-slate-800 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingTitleLaneId(null)} className="p-1 text-rose-400 hover:bg-slate-800 rounded">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <h2 className="text-base font-semibold text-white tracking-tight">{lane.title}</h2>
                      <button 
                        onClick={() => startEditLane(lane)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white transition"
                        title="Rename Lane"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Add Bar */}
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
                <div className="flex-1 p-3 overflow-y-auto space-y-2.5 max-h-[calc(100vh-250px)] min-h-[300px]">
                  {laneTasks.length === 0 ? (
                    <div className="h-40 border-2 border-dashed border-slate-800/80 rounded-xl flex flex-col items-center justify-center text-slate-500 text-xs gap-1.5 p-4 text-center">
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
                              onKeyDown={(e) => e.key === 'Enter' && saveEditTask()}
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
                                  title="Move to left lane"
                                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {idx < lanes.length - 1 && (
                                <button
                                  onClick={() => moveTask(task.id, 1)}
                                  title="Move to right lane"
                                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => startEditTask(task)}
                                title="Edit text"
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
        </div>
      </main>
    </div>
  );
}
