import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Boxes,
  Braces,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  Code2,
  Cpu,
  Database,
  FileCode2,
  FileSearch,
  Filter,
  Gauge,
  GitBranch,
  History,
  Landmark,
  Layers3,
  LayoutDashboard,
  ListTree,
  Network,
  Plug,
  Scale,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Table2,
  UserRound,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconTile, type IconTone } from "@/components/icon-tile";
import meridianLogo from "@/assets/meridian-logo-3d.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian CI — Connected Intelligence" },
      {
        name: "description",
        content: "Explore connected banking systems, business rules, and program relationships in Meridian CI.",
      },
      { property: "og:title", content: "Meridian CI — Connected Intelligence" },
      {
        property: "og:description",
        content: "Explore connected banking systems, business rules, and program relationships in Meridian CI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MeridianApp,
});

type View = "search" | "overview" | "graph";

type IconItem = { label: string; icon: LucideIcon; tone: IconTone };

const sectionItems: IconItem[] = [
  { label: "Overview", icon: LayoutDashboard, tone: "violet" },
  { label: "Business rules", icon: Scale, tone: "mint" },
  { label: "Dependencies", icon: GitBranch, tone: "amber" },
  { label: "Data & SQL", icon: Database, tone: "sky" },
  { label: "Source", icon: FileCode2, tone: "blush" },
  { label: "History", icon: History, tone: "rose" },
];

const graphNavItems: IconItem[] = [
  { label: "Graph", icon: Network, tone: "violet" },
  { label: "Impact", icon: Zap, tone: "amber" },
  { label: "Lineage", icon: Workflow, tone: "mint" },
  { label: "Code", icon: Code2, tone: "sky" },
  { label: "API", icon: Plug, tone: "blush" },
];

const resultTones: IconTone[] = ["violet", "mint", "sky", "amber", "blush", "rose"];

const copybooks: { name: string; note: string; tone: IconTone }[] = [
  { name: "CPYACCT", note: "Account data structures", tone: "sky" },
  { name: "CPYERR", note: "Error handling definitions", tone: "blush" },
  { name: "CPYTAXP", note: "Tax parameter layouts", tone: "mint" },
];

const programs = [
  { name: "CEE3DLY", risk: "low", score: 18 },
  { name: "DSNTIAR", risk: "low", score: 22 },
  { name: "GLPOST01", risk: "high", score: 84 },
  { name: "IKJEFT01", risk: "low", score: 15 },
  { name: "INTPOST2", risk: "high", score: 92 },
  { name: "RECON001", risk: "high", score: 78 },
  { name: "TAXCALC", risk: "low", score: 31 },
  { name: "TRDORD01", risk: "low", score: 27 },
  { name: "TRDSETL1", risk: "high", score: 81 },
];

const highRisk = programs.filter((program) => program.risk === "high").sort((a, b) => b.score - a.score);
const lowRisk = programs.filter((program) => program.risk === "low");

const relationships = [
  ["ACCESSES", 82],
  ["BELONGS_TO_DOMAIN", 1],
  ["CALLS_PROGRAM", 3],
  ["DECLARES", 55],
  ["EXECUTES_SQL", 15],
  ["HAS_CONDITION", 6],
  ["HAS_DATA_SECTION", 15],
  ["HAS_EVALUATE", 4],
  ["INCLUDES_COPYBOOK", 3],
  ["PART_OF_APPLICATION", 1],
  ["PERFORMS_PARAGRAPH", 61],
  ["READS_FILE", 1],
  ["REFERENCES_TABLE", 14],
  ["WRITES_FILE", 6],
  ["COUPLED_VIA_DATA", 2],
  ["COUPLED_VIA_SQL", 2],
];

const paragraphs = [
  "0000-MAINLINE",
  "1000-INITIALIZE",
  "1000-EXIT",
  "2000-PROCESS-CURSOR",
  "2000-EXIT",
  "3000-FINALIZE",
  "3000-EXIT",
  "9100-DB2-FATAL",
  "2100-POST-ONE-ACCOUNT",
  "2100-EXIT",
  "2900-RECOVER-CONTENTION",
  "2900-EXIT",
  "2110-COMPUTE-INTEREST",
  "2110-EXIT",
  "2200-DB2-POSTINGS",
];

const resultRows = [
  { program: "INTPOST2", match: "Exact Match", score: "1.000" },
  { program: "INTPOST2", match: "Exact Match", score: "1.000" },
  { program: "INTPOST2/POSTINT (JOB04110)", match: "Substring Match", score: "0.800" },
  { program: "GLPOST01", match: "Related Program", score: "0.790" },
  { program: "TRDSETL1", match: "Related Program", score: "0.740" },
  { program: "RECON001", match: "Related Program", score: "0.710" },
  { program: "TAXCALC", match: "Related Program", score: "0.680" },
  { program: "DSNTIAR", match: "Program Reference", score: "0.610" },
];

function MeridianApp() {
  const [view, setView] = useState<View>("search");
  const [query, setQuery] = useState("what are copy books used by INTPOST2.cbl");
  const [searched, setSearched] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [enabledKinds, setEnabledKinds] = useState<string[]>(relationships.map(([name]) => String(name)));
  const [selectedNode, setSelectedNode] = useState("INTPOST2");
  const [toast, setToast] = useState("");
  const activeSection: IconItem = sectionItems.find((item) => item.label === activeTab) ?? { label: "Overview", icon: LayoutDashboard, tone: "violet" };

  const graphNodes = useMemo(() => {
    return Array.from({ length: 126 }, (_, i) => {
      const angle = i * 2.399963;
      const radius = 30 + Math.sqrt(i + 1) * 13;
      return {
        id: i,
        x: 390 + Math.cos(angle) * radius,
        y: 240 + Math.sin(angle) * radius * 0.78,
        color: ["var(--graph-node-1)", "var(--graph-node-2)", "var(--graph-node-3)", "var(--graph-node-4)", "var(--graph-node-5)"][i % 5],
        edge: i % 4 !== 0,
      };
    });
  }, []);

  function submitSearch(event?: FormEvent) {
    event?.preventDefault();
    setView("search");
    setSearched(true);
    setShowAll(true);
    setExpanded(0);
  }

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function openOverview() {
    setView("overview");
    setActiveTab("Overview");
  }

  function openGraph() {
    setView("graph");
  }

  return (
    <div className="meridian-app">
      <header className="topbar">
        <button className="brand" onClick={() => setView("search")} aria-label="Meridian CI home">
          <span className="brand-mark-3d"><img src={meridianLogo} alt="" width={256} height={256} /></span>
          <span className="brand-text">Meridian <em>CI</em></span>
        </button>
        <form className="top-search" onSubmit={submitSearch}>
          <IconTile icon={Search} tone="sky" size="xs" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search the knowledge graph"
            placeholder="Search the knowledge graph..."
          />
          <Button size="icon" aria-label="Search" type="submit"><Search /></Button>
        </form>
        <button className="persona-pill" onClick={() => notify("Business persona selected")}><IconTile icon={UserRound} tone="mint" size="xs" />Persona: Business</button>
        <button className="help-button" aria-label="Help" onClick={() => notify("Meridian CI help center")}><IconTile icon={CircleHelp} tone="amber" size="sm" /></button>
      </header>

      {view === "search" && (
        <div className="workspace search-workspace">
          <aside className="left-rail">
            <nav className="primary-nav" aria-label="Main navigation">
              <button className="nav-item is-current"><IconTile icon={Search} tone="sky" />Search</button>
              <button className="nav-item" onClick={openGraph}><IconTile icon={Network} tone="violet" />Graph</button>
              <button className="nav-item" onClick={() => notify("Risk summary selected")}><IconTile icon={ShieldAlert} tone="blush" />Risk summary</button>
              <button className="nav-item" onClick={() => notify("Dependencies selected")}><IconTile icon={GitBranch} tone="amber" />Dependencies</button>
              <button className="nav-item" onClick={() => notify("Integrity selected")}><IconTile icon={Activity} tone="mint" />Integrity</button>
              <button className="nav-item" onClick={() => notify("Curation selected")}><IconTile icon={Layers3} tone="rose" />Curation</button>
            </nav>
            <section className="rail-section risk-summary" aria-label="Risk summary">
              <div className="rail-label"><IconTile icon={Gauge} tone="sky" size="xs" />Risk summary</div>
              <div className="risk-overview">
                <div className="risk-overview-top">
                  <span className="risk-total"><strong>{programs.length}</strong>programs</span>
                  <span className="risk-legend"><span><span className="risk-dot high" />{highRisk.length} high</span><span><span className="risk-dot" />{lowRisk.length} low</span></span>
                </div>
                <div className="risk-ratio" role="img" aria-label={`${highRisk.length} high risk, ${lowRisk.length} low risk`}>
                  <span className="risk-ratio-high" style={{ flexGrow: highRisk.length }} />
                  <span className="risk-ratio-low" style={{ flexGrow: lowRisk.length }} />
                </div>
              </div>
              <div className="risk-group-label"><ShieldAlert size={12} />Needs attention</div>
              <div className="risk-cards">
                {highRisk.map((program) => (
                  <button key={program.name} className="risk-card" onClick={() => { setQuery(program.name); submitSearch(); }}>
                    <span className="risk-card-top"><strong>{program.name}</strong><span className="risk-pill">High</span></span>
                    <span className="risk-meter"><span style={{ width: `${program.score}%` }} /></span>
                    <span className="risk-card-score">Risk score {program.score}</span>
                  </button>
                ))}
              </div>
              <div className="risk-group-label is-stable"><CircleCheck size={12} />Stable</div>
              <div className="risk-chips">
                {lowRisk.map((program) => (
                  <button key={program.name} className="risk-chip" onClick={() => { setQuery(program.name); submitSearch(); }}>
                    <span className="risk-dot" />{program.name}
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <main className="main-content search-main">
            <div className="page-heading">
              <HeadingInfographic />
              <div className="page-heading-main">
                <IconTile icon={Landmark} tone="violet" size="lg" />
                <div>
                <div className="eyebrow"><span className="eyebrow-dot" />Connected intelligence</div>
                <h1>Meridian Connected Intelligence Platform</h1>
                <p>Trade and Settlement Banking System <span className="heading-separator">—</span> Legacy COBOL Knowledge Graph</p>
                </div>
              </div>
              <div className="heading-status"><span className="status-indicator" /> Systems online</div>
            </div>
            <form className="query-form" onSubmit={submitSearch}>
              <div className="query-input-wrap"><IconTile icon={Search} tone="sky" size="sm" /><Input aria-label="Search query" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
              <Button type="submit" className="primary-action"><Search size={16} />Search</Button>
              <Button type="button" variant="outline" onClick={() => setShowAll((value) => !value)}>{showAll ? "Show fewer" : "Show more results"}</Button>
            </form>
            <div className="suggestions"><span>Try:</span>{["GLPOST01", "tax", "settlement", "WS-BUS-DATE", "reconciliation"].map((item, i) => <button className={i === 2 ? "suggestion is-highlighted" : "suggestion"} key={item} onClick={() => { setQuery(item); submitSearch(); }}>{item}</button>)}</div>

            <section className="intelligence-summary">
              <div className="summary-heading"><IconTile icon={Sparkles} tone="violet" size="sm" /> Intelligence summary <span className="summary-live">AI INSIGHT</span></div>
              <p>Based on the system analysis, <strong>INTPOST2.cbl</strong> uses three copybooks:</p>
              <ul className="copybook-list">
                {copybooks.map((book) => <li key={book.name}><IconTile icon={FileCode2} tone={book.tone} size="sm" /><span><strong>{book.name}</strong> — {book.note}</span></li>)}
              </ul>
              <p className="summary-last">These are declared in the program&apos;s COPY statements and provide shared record layouts for account processing, error logging, and tax calculation interfaces. INTPOST2 is rated <strong className="critical-text">Critical</strong> modernisation risk due to its core role in deposit interest posting and tight SQL/data coupling with GLPOST01, RECON001, and TRDSETL1.</p>
            </section>

            <div className="results-meta">Found <strong>{searched ? 8 : 3} results</strong> for <strong>{query || "all programs"}</strong><button onClick={() => notify("Results sorted by relevance")}><IconTile icon={SlidersHorizontal} tone="amber" size="xs" /> Relevance</button></div>
            <div className="result-list">
              {resultRows.slice(0, showAll || searched ? resultRows.length : 3).map((row, index) => (
                <section className={`result-card ${expanded === index ? "is-expanded" : ""}`} key={`${row.program}-${index}`}>
                  <button className="result-head" onClick={() => setExpanded(expanded === index ? null : index)} aria-expanded={expanded === index}>
                    <span className="result-rank">#{index + 1}</span>
                    <IconTile icon={FileCode2} tone={resultTones[index % resultTones.length] ?? "violet"} size="sm" />
                    <strong className="result-program">{row.program}</strong>
                    <span className="match-badge">{row.match}</span>
                    <span className="result-score">Score: {row.score}</span>
                    {expanded === index ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                  </button>
                  {expanded === index && (
                    <div className="result-detail">
                      <div className="result-fields">
                        <div><IconTile icon={FileCode2} tone="violet" size="sm" /><span>Program</span><strong>INTPOST2</strong></div>
                        <div><IconTile icon={Cpu} tone="sky" size="sm" /><span>Technology</span><strong>COBOL</strong></div>
                        <div><IconTile icon={Gauge} tone="mint" size="sm" /><span>Score</span><strong>1.0000</strong></div>
                        <div><IconTile icon={ShieldAlert} tone="blush" size="sm" /><span>Modernisation risk</span><strong className="risk-badge">Critical</strong></div>
                      </div>
                      <Button onClick={openOverview} className="overview-action">Open Overview for INTPOST2 <ArrowRight size={15} /></Button>
                    </div>
                  )}
                </section>
              ))}
            </div>
            <details className="raw-response"><summary><IconTile icon={Braces} tone="amber" size="xs" />Raw JSON response</summary><pre>{JSON.stringify({ query, count: 8, program: "INTPOST2", score: 1 }, null, 2)}</pre></details>
          </main>
        </div>
      )}

      {view === "overview" && (
        <div className="workspace overview-workspace">
          <aside className="left-rail overview-rail">
            <button className="back-rail" onClick={() => setView("search")}><ArrowLeft size={15} /> Back</button>
            <nav className="overview-nav" aria-label="Program sections">
              {sectionItems.map((item) => <button key={item.label} className={`nav-item ${activeTab === item.label ? "is-current" : ""}`} onClick={() => setActiveTab(item.label)}><IconTile icon={item.icon} tone={item.tone} />{item.label}</button>)}
            </nav>
          </aside>
          <main className="main-content overview-main">
            <button className="inline-back" onClick={() => setView("search")}><ArrowLeft size={15} />Back to search</button>
            <div className="hero-card program-hero"><HeadingInfographic /><div className="breadcrumbs">Portfolio <ChevronRight size={13} /> Settlement <ChevronRight size={13} /> <strong>INTPOST2</strong></div>
            <div className="program-title"><IconTile icon={FileCode2} tone="violet" size="lg" /><h1>INTPOST2</h1><span>Interest Posting</span><span className="program-chip"><span className="risk-dot high" /> Critical risk</span></div></div>
            <nav className="tabs" aria-label="Program details">
              {sectionItems.map((tab) => <button key={tab.label} className={activeTab === tab.label ? "tab is-active" : "tab"} onClick={() => setActiveTab(tab.label)}><IconTile icon={tab.icon} tone={tab.tone} size="xs" />{tab.label}</button>)}
            </nav>
            {activeTab === "Overview" ? <div className="overview-grid">
              <section className="data-panel paragraphs-panel"><PanelHeading icon={ListTree} tone="mint" title="Paragraphs" subtitle="Click to open source" /><div className="paragraph-list">{paragraphs.map((p) => <button key={p} className="paragraph-row" onClick={() => { setActiveTab("Source"); notify(`${p} source opened`); }}><strong>{p}</strong><span>PERFORMS</span></button>)}</div></section>
              <section className="data-panel relationships-panel"><PanelHeading icon={Network} tone="violet" title="Relationships" subtitle="Click to drill through" /><div className="relationship-list">{relationships.map(([label, value]) => <button className="relationship-row" key={String(label)} onClick={() => { setQuery(String(label)); openGraph(); }}><span className="relationship-name">{label}</span><span className="bar-track"><span style={{ width: `${Math.max(Number(value) / 82 * 100, 2)}%` }} /></span><span className="relationship-count">{value}</span></button>)}</div></section>
              <section className="data-panel evidence-panel"><PanelHeading icon={FileSearch} tone="amber" title="Evidence" /><pre className="code-evidence">{`PERFORM 0000-MAINLINE\nPERFORM 1000-INITIALIZE\nCALL 'TAXCALC'\nCALL 'CEE3DLY'\nSQL --> INCLUDE\nSQL --> DECLARE`}</pre><div className="evidence-caption">INTPOST2.cbl · Parsed successfully</div><div className="evidence-actions"><Button onClick={openGraph}><Network size={15} />Open in graph</Button><Button variant="outline" onClick={() => notify("Impact analysis is ready")}><Zap size={15} />Impact analysis</Button><Button variant="outline" onClick={() => notify("Added to modernisation wave")}><Layers3 size={15} />Add to wave</Button><Button variant="outline" onClick={() => notify("Flagged for review")}><ShieldAlert size={15} />Flag for review</Button></div></section>
            </div> : <section className="tab-content-panel"><PanelHeading icon={activeSection.icon} tone={activeSection.tone} title={activeTab} subtitle="INTPOST2 · Interest Posting" /><p>This program is connected to the settlement processing domain and shares data structures with account, tax, and reconciliation workflows.</p><div className="tab-content-stats"><span><IconTile icon={ListTree} tone="mint" size="sm" /><strong>15</strong> paragraphs</span><span><IconTile icon={FileCode2} tone="sky" size="sm" /><strong>6</strong> copybooks</span><span><IconTile icon={Table2} tone="amber" size="sm" /><strong>23</strong> referenced tables</span></div><Button onClick={openGraph}><Network size={15} />Explore relationships</Button></section>}
          </main>
        </div>
      )}

      {view === "graph" && (
        <div className="workspace graph-workspace">
          <aside className="graph-nav">
            <button className="back-rail" onClick={() => setView("overview")}><ArrowLeft size={15} /> Overview</button>
            {graphNavItems.map((item) => <button key={item.label} className={item.label === "Graph" ? "graph-nav-item is-current" : "graph-nav-item"} onClick={() => item.label === "Graph" ? undefined : notify(`${item.label} view selected`)}><IconTile icon={item.icon} tone={item.tone} />{item.label}</button>)}
          </aside>
          <aside className="filter-rail">
            <div className="filter-title"><IconTile icon={Filter} tone="violet" size="xs" />Relationship filters <button onClick={() => setEnabledKinds(relationships.map(([name]) => String(name)))}>All</button><button onClick={() => setEnabledKinds([])}>None</button></div>
            <div className="filter-list">{relationships.map(([name]) => <label key={String(name)} className="filter-item"><input type="checkbox" checked={enabledKinds.includes(String(name))} onChange={() => setEnabledKinds((items) => items.includes(String(name)) ? items.filter((item) => item !== name) : [...items, String(name)])} /><span>{name}</span></label>)}</div>
          </aside>
          <main className="graph-main">
            <div className="graph-heading"><div><span className="graph-node-dot" /><strong>{selectedNode}</strong></div><span>Double-click any connected node to pivot · Scroll to zoom</span></div>
            <section className="graph-canvas" aria-label="Program relationship graph">
              <svg viewBox="0 0 780 480" role="img" aria-label="INTPOST2 connected program graph">
                {graphNodes.map((node) => node.edge && enabledKinds.length > 0 ? <line key={`edge-${node.id}`} x1="390" y1="240" x2={node.x} y2={node.y} className={`graph-edge graph-edge-${node.id % 5}`} /> : null)}
                {graphNodes.map((node) => <circle key={node.id} cx={node.x} cy={node.y} r={node.id % 9 === 0 ? 5.4 : 4.1} fill={node.id === 0 ? "var(--graph-center)" : node.color} className="graph-node" onClick={() => setSelectedNode(node.id % 4 === 0 ? "TAXCALC" : node.id % 3 === 0 ? "GLPOST01" : "INTPOST2")} onDoubleClick={() => setSelectedNode(node.id % 4 === 0 ? "TAXCALC" : "GLPOST01")} />)}
              </svg>
            </section>
            <div className="graph-stats"><div><IconTile icon={Boxes} tone="violet" size="md" /><strong>15</strong><span>programs<br />impacted</span></div><div><IconTile icon={FileCode2} tone="mint" size="md" /><strong>6</strong><span>copybooks</span></div><div><IconTile icon={Table2} tone="amber" size="md" /><strong>23</strong><span>tables</span></div></div>
            <details className="raw-response graph-raw"><summary><IconTile icon={Braces} tone="amber" size="xs" />Raw JSON response</summary><pre>{JSON.stringify({ node: selectedNode, relationships: enabledKinds.length, programsImpacted: 15 }, null, 2)}</pre></details>
          </main>
        </div>
      )}
      {toast && <div className="toast-message" role="status"><IconTile icon={CircleCheck} tone="mint" size="xs" />{toast}</div>}
    </div>
  );
}

function PanelHeading({ title, subtitle, icon, tone }: { title: string; subtitle?: string; icon: LucideIcon; tone: IconTone }) {
  return <div className="panel-heading"><IconTile icon={icon} tone={tone} size="sm" /><strong>{title}</strong>{subtitle && <span>· {subtitle}</span>}</div>;
}
function HeadingInfographic() {
  return (
  <svg className="heading-infographic" viewBox="0 0 520 150" aria-hidden="true" preserveAspectRatio="xMinYMid meet">
    <g className="info-grid">{Array.from({ length: 14 }, (_, i) => <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="150" />)}{Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 36} x2="520" y2={i * 36} />)}</g>
    <g className="info-links"><path d="M30 110 L95 60 L170 92 L240 40 L320 78 L400 30 L480 62" /><path d="M95 60 L120 130 M240 40 L260 120 M400 30 L430 115" /></g>
    {[[30,110],[95,60],[170,92],[240,40],[320,78],[400,30],[480,62],[120,130],[260,120],[430,115]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 6 : 4} className={`info-node n${i % 3}`} />)}
    <g className="info-bars">{[26,44,34,58,48,70,62].map((h,i) => <rect key={i} x={360 + i * 18} y={150 - h} width="10" height={h} rx="3" />)}</g>
    <g className="info-rings"><circle cx="470" cy="40" r="26" /><circle cx="470" cy="40" r="16" /></g>
  </svg>
  );
}
