import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Timer,
  ClipboardCheck,
  Settings,
  Search,
  Bell,
  Plus,
  Sparkles,
  ChevronDown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Target,
  Lightbulb,
  TrendingUp,
  Users,
  X,
  Mic,
  Trophy,
  Zap,
  Menu,
  Save,
} from "lucide-react";
import "./App.css";

const initialPitch = {
  title: "EcoTrack",
  tagline: "Making sustainable living measurable.",
  problem:
    "Students want to make sustainable choices, but they lack a simple way to understand their daily environmental impact. Existing tools are complicated and don't fit into campus life.",
  solution:
    "EcoTrack is a campus sustainability platform that tracks daily habits, estimates carbon footprint, and recommends simple eco-friendly actions.",
  innovation:
    "Unlike traditional carbon calculators, EcoTrack combines campus-specific data, personalized recommendations, and friendly team challenges to make sustainability engaging.",
  impact:
    "We aim to help students reduce their carbon footprint, build sustainable habits, and create a greener campus community.",
  feasibility:
    "Our prototype uses a React frontend, a lightweight backend, and publicly available environmental datasets. We can demonstrate the core experience during the hackathon.",
  closing:
    "EcoTrack turns small everyday choices into measurable environmental change. Together, we can make sustainability part of campus culture.",
};

const rubric = [
  { key: "problem", label: "Problem clarity", weight: 20 },
  { key: "solution", label: "Solution quality", weight: 25 },
  { key: "innovation", label: "Innovation", weight: 20 },
  { key: "impact", label: "Potential impact", weight: 20 },
  { key: "feasibility", label: "Feasibility", weight: 15 },
];

const initialNav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Pitch Builder", icon: FileText },
  { label: "Rehearsal", icon: Timer },
  { label: "Judge Simulator", icon: ClipboardCheck },
];

const fieldLabels = {
  problem: "Problem",
  solution: "Solution",
  innovation: "Innovation",
  impact: "Impact",
  feasibility: "Feasibility",
  closing: "Closing statement",
};

function App() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [pitch, setPitch] = useState(initialPitch);
  const [duration, setDuration] = useState(90);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [activeField, setActiveField] = useState("problem");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [search, setSearch] = useState("");
  const [rehearsals, setRehearsals] = useState(3);
  const [showSaved, setShowSaved] = useState(false);

  const sections = useMemo(
    () => [
      { key: "problem", label: "Problem", description: "What challenge are you solving?" },
      { key: "solution", label: "Solution", description: "How does your project solve it?" },
      { key: "innovation", label: "Innovation", description: "What makes your idea different?" },
      { key: "impact", label: "Impact", description: "Who benefits and how?" },
      { key: "feasibility", label: "Feasibility", description: "Can you realistically build it?" },
      { key: "closing", label: "Closing", description: "End with a memorable statement." },
    ],
    []
  );

  const coverage = useMemo(() => {
    const required = ["problem", "solution", "innovation", "impact", "feasibility"];
    const completed = required.filter((key) => pitch[key].trim().length >= 45);
    return Math.round((completed.length / required.length) * 100);
  }, [pitch]);

  const missingSections = useMemo(() => {
    return sections.filter((section) => {
      const text = pitch[section.key].trim();
      return text.length < 45;
    });
  }, [pitch, sections]);

  const wordCount = useMemo(() => {
    return Object.values(pitch)
      .join(" ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
  }, [pitch]);

  const estimatedSeconds = Math.round(wordCount / 2.4);
  const rubricScore = Math.min(
    100,
    Math.round(
      rubric.reduce((sum, item) => {
        const text = pitch[item.key].trim();
        const sectionScore = Math.min(100, Math.round((text.length / 180) * 100));
        return sum + sectionScore * (item.weight / 100);
      }, 0)
    )
  );

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setRehearsals((count) => count + 1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const updatePitch = (key, value) => {
    setPitch((prev) => ({ ...prev, [key]: value }));
    setShowSaved(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const savePitch = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const startRehearsal = () => {
    setActiveNav("Rehearsal");
    setIsRunning(true);
  };

  const renderOverview = () => (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow"><Sparkles size={14} /> YOUR PITCH WORKSPACE</div>
          <h1>Make your pitch <span>impossible to forget.</span></h1>
          <p className="welcome-subtitle">
            Sharpen your story, practice your delivery, and walk into your next hackathon with confidence.
          </p>
        </div>
        <button className="primary-btn" onClick={() => setActiveNav("Pitch Builder")}>
          <Plus size={17} /> Build your pitch
        </button>
      </div>

      <div className="project-banner">
        <div className="project-banner-content">
          <div className="project-tag"><Zap size={13} /> ACTIVE PROJECT</div>
          <h2>{pitch.title || "Untitled Project"}</h2>
          <p>{pitch.tagline || "Add a short tagline for your project."}</p>
          <div className="project-meta">
            <span><Clock size={14} /> {duration === 60 ? "60-second pitch" : duration === 90 ? "90-second pitch" : "3-minute pitch"}</span>
            <span><FileText size={14} /> {wordCount} words</span>
          </div>
        </div>
        <div className="banner-orbit">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit-core"><Mic size={32} /></div>
          <span className="orbit-dot dot-one" />
          <span className="orbit-dot dot-two" />
          <span className="orbit-dot dot-three" />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={<Target />}
          label="Pitch readiness"
          value={`${coverage}%`}
          trend="Content coverage"
          color="purple"
        />
        <StatCard
          icon={<ClipboardCheck />}
          label="Judge score"
          value={`${rubricScore}/100`}
          trend="Simulated evaluation"
          color="blue"
        />
        <StatCard
          icon={<Timer />}
          label="Estimated time"
          value={formatTime(estimatedSeconds)}
          trend={`${duration}s target`}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp />}
          label="Rehearsals"
          value={rehearsals}
          trend="Practice sessions"
          color="green"
        />
      </div>

      <div className="content-grid">
        <section className="panel coverage-panel">
          <div className="panel-heading">
            <div>
              <h3>Pitch coverage</h3>
              <p>Are you covering what judges care about?</p>
            </div>
            <button className="icon-btn" onClick={() => setActiveNav("Pitch Builder")}><ArrowUpRight size={17} /></button>
          </div>

          <div className="coverage-content">
            <div className="coverage-ring" style={{ "--coverage": `${coverage}%` }}>
              <div className="coverage-ring-inner">
                <strong>{coverage}%</strong>
                <span>Covered</span>
              </div>
            </div>
            <div className="coverage-details">
              {sections.slice(0, 5).map((section) => {
                const complete = pitch[section.key].trim().length >= 45;
                return (
                  <div className="coverage-item" key={section.key}>
                    <span className={`coverage-dot ${complete ? "complete" : "incomplete"}`} />
                    <span>{section.label}</span>
                    <span className={`coverage-status ${complete ? "status-complete" : ""}`}>
                      {complete ? "Covered" : "Needs work"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="panel rehearsal-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick rehearsal</h3>
              <p>Practice your pitch against the clock.</p>
            </div>
            <div className="timer-icon"><Timer size={18} /></div>
          </div>
          <div className="quick-timer">
            <div className="timer-display">{formatTime(timeLeft)}</div>
            <div className="timer-caption">{isRunning ? "You're on the clock!" : "Ready when you are"}</div>
          </div>
          <div className="timer-presets">
            {[60, 90, 180].map((seconds) => (
              <button
                key={seconds}
                className={duration === seconds ? "preset active" : "preset"}
                onClick={() => {
                  setDuration(seconds);
                  setIsRunning(false);
                }}
              >
                {seconds === 180 ? "3 min" : `${seconds}s`}
              </button>
            ))}
          </div>
          <div className="timer-actions">
            <button className="primary-btn full-btn" onClick={startRehearsal}>
              <Play size={16} /> Start rehearsal
            </button>
            <button className="secondary-btn timer-reset" onClick={resetTimer}><RotateCcw size={16} /></button>
          </div>
        </section>
      </div>

      <div className="content-grid lower-grid">
        <section className="panel checklist-panel">
          <div className="panel-heading">
            <div>
              <h3>Pitch checklist</h3>
              <p>Complete these components before presenting.</p>
            </div>
            <span className="small-counter">{sections.length - missingSections.length}/{sections.length}</span>
          </div>
          <div className="checklist">
            {sections.map((section) => {
              const complete = pitch[section.key].trim().length >= 45;
              return (
                <button className="checklist-row" key={section.key} onClick={() => {
                  setActiveField(section.key);
                  setActiveNav("Pitch Builder");
                }}>
                  <span className={`check-icon ${complete ? "checked" : ""}`}>
                    {complete ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  </span>
                  <span className="checklist-text">
                    <strong>{section.label}</strong>
                    <small>{complete ? "Your section is looking good" : "Add more detail to this section"}</small>
                  </span>
                  <ArrowUpRight size={15} className="check-arrow" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel rubric-preview">
          <div className="panel-heading">
            <div>
              <h3>Judge's perspective</h3>
              <p>How your pitch is evaluated.</p>
            </div>
            <Trophy size={20} className="trophy-icon" />
          </div>
          <div className="rubric-score-row">
            <div>
              <strong className="rubric-score">{rubricScore}</strong><span>/100</span>
            </div>
            <span className={`score-label ${rubricScore >= 70 ? "good" : "needs-work"}`}>
              {rubricScore >= 70 ? "Promising pitch" : "Room to improve"}
            </span>
          </div>
          {rubric.map((item) => {
            const score = Math.min(100, Math.round((pitch[item.key].trim().length / 180) * 100));
            return (
              <div className="rubric-bar-row" key={item.key}>
                <div className="rubric-bar-label"><span>{item.label}</span><strong>{score}%</strong></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${score}%` }} /></div>
              </div>
            );
          })}
          <button className="text-link" onClick={() => setActiveNav("Judge Simulator")}>View full rubric <ArrowUpRight size={15} /></button>
        </section>
      </div>
    </>
  );

  const renderBuilder = () => (
    <div className="builder-page">
      <div className="page-heading-row">
        <div>
          <div className="eyebrow"><FileText size={14} /> PITCH BUILDER</div>
          <h1>Build your <span>story.</span></h1>
          <p>Structure your pitch so every second counts.</p>
        </div>
        <button className="primary-btn" onClick={savePitch}><Save size={16} /> {showSaved ? "Saved!" : "Save pitch"}</button>
      </div>

      <div className="builder-layout">
        <aside className="builder-sections panel">
          <h3>Pitch sections</h3>
          <p className="muted">Your pitch outline</p>
          {sections.map((section, index) => {
            const complete = pitch[section.key].trim().length >= 45;
            return (
              <button
                key={section.key}
                className={`builder-section ${activeField === section.key ? "selected" : ""}`}
                onClick={() => setActiveField(section.key)}
              >
                <span className="section-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="section-label">
                  <strong>{section.label}</strong>
                  <small>{complete ? "Covered" : "Draft needed"}</small>
                </span>
                {complete && <CheckCircle2 size={16} className="section-check" />}
              </button>
            );
          })}
          <div className="builder-progress">
            <div className="builder-progress-label"><span>Overall coverage</span><strong>{coverage}%</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${coverage}%` }} /></div>
          </div>
        </aside>

        <section className="panel editor-panel">
          <div className="editor-topline">
            <span className="editor-badge"><Sparkles size={13} /> EDITING SECTION</span>
            <span className="word-counter">{pitch[activeField].trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <h2>{fieldLabels[activeField]}</h2>
          <p className="editor-description">{sections.find((section) => section.key === activeField)?.description}</p>

          {activeField === "problem" && (
            <div className="project-details">
              <label>Project name</label>
              <input value={pitch.title} onChange={(e) => updatePitch("title", e.target.value)} placeholder="Your project name" />
              <label>Tagline</label>
              <input value={pitch.tagline} onChange={(e) => updatePitch("tagline", e.target.value)} placeholder="One line that captures your idea" />
            </div>
          )}

          <textarea
            className="pitch-textarea"
            value={pitch[activeField]}
            onChange={(e) => updatePitch(activeField, e.target.value)}
            placeholder={`Write your ${fieldLabels[activeField].toLowerCase()} section here...`}
          />

          <div className="editor-tip">
            <Lightbulb size={17} />
            <div>
              <strong>Pitch tip</strong>
              <p>{getTip(activeField)}</p>
            </div>
          </div>

          <div className="editor-footer">
            <button className="secondary-btn" onClick={() => setActiveNav("Overview")}>Back to overview</button>
            <button className="primary-btn" onClick={() => {
              const index = sections.findIndex((section) => section.key === activeField);
              if (index < sections.length - 1) setActiveField(sections[index + 1].key);
              else savePitch();
            }}>
              {activeField === "closing" ? "Finish pitch" : "Next section"} <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );

  const renderRehearsal = () => (
    <div className="rehearsal-page">
      <div className="page-heading-row">
        <div>
          <div className="eyebrow"><Timer size={14} /> REHEARSAL STUDIO</div>
          <h1>Own the <span>stage.</span></h1>
          <p>Practice your pitch until the delivery feels natural.</p>
        </div>
      </div>

      <div className="rehearsal-layout">
        <section className="panel rehearsal-main">
          <div className="live-label"><span className={isRunning ? "live-dot running" : "live-dot"} /> {isRunning ? "REHEARSAL IN PROGRESS" : "REHEARSAL READY"}</div>
          <div className="large-timer">{formatTime(timeLeft)}</div>
          <p className="timer-caption">{isRunning ? "Keep going. You've got this." : "Take a breath, then start when you're ready."}</p>
          <div className="timer-presets large-presets">
            {[60, 90, 180].map((seconds) => (
              <button
                key={seconds}
                className={duration === seconds ? "preset active" : "preset"}
                onClick={() => {
                  setDuration(seconds);
                  setIsRunning(false);
                }}
              >
                {seconds === 180 ? "3 minutes" : `${seconds} seconds`}
              </button>
            ))}
          </div>
          <div className="rehearsal-controls">
            <button className="primary-btn start-large" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? <><Pause size={18} /> Pause rehearsal</> : <><Play size={18} /> Start rehearsal</>}
            </button>
            <button className="secondary-btn" onClick={resetTimer}><RotateCcw size={17} /> Reset</button>
          </div>
          {timeLeft === 0 && <div className="timer-finished"><Trophy size={18} /> Time's up! Great work completing your rehearsal.</div>}
        </section>

        <section className="panel rehearsal-side">
          <h3>Before you begin</h3>
          <p className="muted">A few reminders for a strong pitch.</p>
          <div className="rehearsal-reminder"><span>01</span><div><strong>Start with a hook</strong><p>Grab the judges' attention in your first 10 seconds.</p></div></div>
          <div className="rehearsal-reminder"><span>02</span><div><strong>Keep it conversational</strong><p>Talk to the judges, not at them.</p></div></div>
          <div className="rehearsal-reminder"><span>03</span><div><strong>End with impact</strong><p>Leave them with a clear reason to remember you.</p></div></div>
          <div className="rehearsal-stat"><div className="rehearsal-stat-icon"><Mic size={18} /></div><div><strong>{rehearsals}</strong><span>Practice sessions completed</span></div></div>
        </section>
      </div>
    </div>
  );

  const renderJudgeSimulator = () => (
    <div className="judge-page">
      <div className="page-heading-row">
        <div>
          <div className="eyebrow"><ClipboardCheck size={14} /> JUDGE SIMULATOR</div>
          <h1>Think like a <span>judge.</span></h1>
          <p>Evaluate your pitch using a mock hackathon judging rubric.</p>
        </div>
        <div className="judge-total"><span>Overall score</span><strong>{rubricScore}<small>/100</small></strong></div>
      </div>

      <div className="judge-summary panel">
        <div className="judge-summary-icon"><Trophy size={25} /></div>
        <div>
          <h2>{rubricScore >= 80 ? "A compelling pitch is taking shape!" : rubricScore >= 60 ? "You're building a promising pitch." : "Let's strengthen your pitch."}</h2>
          <p>This is a simulated evaluation based on how much detail you've included in each section. Real judging depends on clarity, delivery, evidence, and audience response.</p>
        </div>
      </div>

      <div className="judge-rubric-list">
        {rubric.map((item) => {
          const score = Math.min(100, Math.round((pitch[item.key].trim().length / 180) * 100));
          return (
            <div className="panel judge-rubric-card" key={item.key}>
              <div className="judge-rubric-header">
                <div className="judge-rubric-icon"><Target size={18} /></div>
                <div className="judge-rubric-title"><h3>{item.label}</h3><p>Weight in final score: {item.weight}%</p></div>
                <strong className="judge-item-score">{score}<small>/100</small></strong>
              </div>
              <div className="progress-track thick"><div className="progress-fill" style={{ width: `${score}%` }} /></div>
              <div className="judge-feedback">
                {score >= 75
                  ? "Good coverage. Refine this section with specific examples and a clear takeaway."
                  : score >= 40
                  ? "There's a foundation here. Add concrete details, examples, and a stronger explanation."
                  : "This section needs more substance. Make sure you clearly address this judging criterion."}
              </div>
              <button className="text-link" onClick={() => {
                setActiveField(item.key);
                setActiveNav("Pitch Builder");
              }}>Improve this section <ArrowUpRight size={15} /></button>
            </div>
          );
        })}
      </div>
      <div className="judge-disclaimer"><AlertCircle size={15} /> This score is a demo estimate based on text length and coverage, not an AI-generated or official judging result.</div>
    </div>
  );

  const renderContent = () => {
    if (activeNav === "Pitch Builder") return renderBuilder();
    if (activeNav === "Rehearsal") return renderRehearsal();
    if (activeNav === "Judge Simulator") return renderJudgeSimulator();
    return renderOverview();
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Mic size={21} /></div>
          <span>pitch<span className="brand-highlight">pilot</span></span>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          {initialNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`nav-item ${activeNav === item.label ? "active" : ""}`}
                onClick={() => setActiveNav(item.label)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.label === "Pitch Builder" && <span className="nav-dot" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-upgrade">
            <div className="upgrade-icon"><Sparkles size={17} /></div>
            <strong>Pitch with confidence</strong>
            <p>Your next big idea deserves a great story.</p>
            <button onClick={() => setActiveNav("Pitch Builder")}>Improve my pitch <ArrowUpRight size={14} /></button>
          </div>
          <button className="nav-item settings-link" onClick={() => setShowSettings(true)}><Settings size={18} /> Settings</button>
          <div className="profile-row">
            <div className="avatar">VG</div>
            <div className="profile-info"><strong>Student Workspace</strong><span>Free plan</span></div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><strong>{activeNav}</strong></div>
          <div className="topbar-actions">
            <div className="search-box">
              <Search size={16} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search workspace..." />
              {search && <button onClick={() => setSearch("")}><X size={14} /></button>}
            </div>
            <div className="notification-wrap">
              <button className="icon-btn notification-btn" onClick={() => setShowNotifications(!showNotifications)}><Bell size={18} /><span /></button>
              {showNotifications && <div className="notification-popover"><strong>You're all caught up!</strong><p>No new notifications right now.</p></div>}
            </div>
            <div className="top-avatar">VG</div>
          </div>
        </header>

        <div className="page-content">
          {search ? (
            <div className="search-result panel">
              <Search size={20} />
              <div><h3>Search workspace</h3><p>Searching pitch sections for “{search}”.</p></div>
              <button className="secondary-btn" onClick={() => setSearch("")}>Clear search</button>
            </div>
          ) : renderContent()}
        </div>
        <footer className="app-footer"><span>PitchPilot</span><span>Made for the next generation of innovators <Sparkles size={13} /></span></footer>
      </main>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-modal panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSettings(false)}><X size={18} /></button>
            <div className="modal-icon"><Settings size={22} /></div>
            <h2>Workspace settings</h2>
            <p>Customize your PitchPilot workspace.</p>
            <label>Default rehearsal duration</label>
            <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={180}>3 minutes</option>
            </select>
            <button className="primary-btn full-btn" onClick={() => setShowSettings(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className="stat-card panel">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend">{trend}</div>
    </div>
  );
}

function getTip(field) {
  const tips = {
    problem: "Make the judges feel the problem. Use a real example, a surprising statistic, or a relatable pain point.",
    solution: "Explain what your project does in plain language. Avoid jargon and focus on the user's experience.",
    innovation: "Show why your approach is different. What makes your solution stand out from existing alternatives?",
    impact: "Quantify the potential impact wherever possible. Who benefits, and what changes for them?",
    feasibility: "Be realistic about your prototype. Explain your tech stack, implementation plan, and what you've already built.",
    closing: "Finish with a memorable statement or a clear call to action. Don't just say thank you.",
  };
  return tips[field] || "Keep your message clear, specific, and memorable.";
}

export default App;