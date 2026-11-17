import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Code2,
  Database,
  FileCode2,
  GitBranch,
  Landmark,
  Layers3,
  Link2,
  Network,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const programs = [
  { name: "CEE3DLY", risk: "low" },
  { name: "DSNTIAR", risk: "low" },
  { name: "GLPOST01", risk: "high" },
  { name: "IKJEFT01", risk: "low" },
  { name: "INTPOST2", risk: "high" },
  { name: "RECON001", risk: "high" },
  { name: "TAXCALC", risk: "low" },
  { name: "TRDORD01", risk: "low" },
  { name: "TRDSETL1", risk: "high" },
];

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

const couplings: [string, string][] = [
  ["GLPOST01", "INTPOST2"],
  ["GLPOST01", "TRDSETL1"],
  ["INTPOST2", "RECON001"],
  ["INTPOST2", "TRDSETL1"],
  ["RECON001", "TRDSETL1"],
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
          <span className="brand-mark"><Landmark aria-hidden="true" /></span>
          <span>Meridian CI</span>
        </button>
        <form className="top-search" onSubmit={submitSearch}>
          <Search size={15} aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search the knowledge graph"
            placeholder="Search the knowledge graph..."
          />
          <Button size="icon" aria-label="Search" type="submit"><Search /></Button>
        </form>
        <button className="persona-pill" onClick={() => notify("Business persona selected")}>Persona: Business</button>
        <button className="help-button" aria-label="Help" onClick={() => notify("Meridian CI help center")}><CircleHelp size={19} /></button>
      </header>

      {view === "search" && (
        <div className="workspace search-workspace">
          <aside className="left-rail">
            <nav className="primary-nav" aria-label="Main navigation">
              <button className="nav-item is-current"><Search size={16} />Search</button>
              <button className="nav-item" onClick={openGraph}><Network size={16} />Graph</button>
              <button className="nav-item" onClick={() => notify("Risk summary selected")}><ShieldAlert size={16} />Risk summary</button>
              <button className="nav-item" onClick={() => notify("Dependencies selected")}><GitBranch size={16} />Dependencies</button>
              <button className="nav-item" onClick={() => notify("Integrity selected")}><Activity size={16} />Integrity</button>
              <button className="nav-item" onClick={() => notify("Curation selected")}><Layers3 size={16} />Curation</button>
            </nav>
            <div className="rail-section">
              <div className="rail-label">Risk summary</div>
              {programs.map((program) => (
                <button key={program.name} className="risk-program" onClick={() => { setQuery(program.name); submitSearch(); }}>
                  <span className={`risk-dot ${program.risk}`} />{program.name}
                </button>
              ))}
            </div>
            <div className="rail-section coupling-section">
              <div className="rail-label">Program couplings</div>
              {couplings.map(([a, b]) => <button className="coupling" key={`${a}-${b}`} onClick={() => { setQuery(a); submitSearch(); }}><strong>{a} → {b}</strong><span>COUPLED_VIA_SQL · conf 0.90</span></button>)}
            </div>
          </aside>

          <main className="main-content search-main">
            <div className="page-heading">
              <div>
                <div className="eyebrow"><span className="eyebrow-dot" />Connected intelligence</div>
                <h1>Meridian Connected Intelligence Platform</h1>
                <p>Trade and Settlement Banking System <span className="heading-separator">—</span> Legacy COBOL Knowledge Graph</p>
              </div>
              <div className="heading-status"><span className="status-indicator" /> Systems online</div>
            </div>
            <form className="query-form" onSubmit={submitSearch}>
              <div className="query-input-wrap"><Search size={18} /><Input aria-label="Search query" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
              <Button type="submit" className="primary-action"><Search size={16} />Search</Button>
              <Button type="button" variant="outline" onClick={() => setShowAll((value) => !value)}>{showAll ? "Show fewer" : "Show more results"}</Button>
            </form>
            <div className="suggestions"><span>Try:</span>{["GLPOST01", "tax", "settlement", "WS-BUS-DATE", "reconciliation"].map((item, i) => <button className={i === 2 ? "suggestion is-highlighted" : "suggestion"} key={item} onClick={() => { setQuery(item); submitSearch(); }}>{item}</button>)}</div>

            <section className="intelligence-summary">
              <div className="summary-heading"><Sparkles size={15} /> Intelligence summary <span className="summary-live">AI INSIGHT</span></div>
              <p>Based on the system analysis, <strong>INTPOST2.cbl</strong> uses three copybooks:</p>
              <ul>
                <li><strong>CPYACCT</strong> — Account data structures</li>
                <li><strong>CPYERR</strong> — Error handling definitions</li>
                <li><strong>CPYTAXP</strong> — Tax parameter layouts</li>
              </ul>
              <p className="summary-last">These are declared in the program&apos;s COPY statements and provide shared record layouts for account processing, error logging, and tax calculation interfaces. INTPOST2 is rated <strong className="critical-text">Critical</strong> modernisation risk due to its core role in deposit interest posting and tight SQL/data coupling with GLPOST01, RECON001, and TRDSETL1.</p>
            </section>

            <div className="results-meta">Found <strong>{searched ? 8 : 3} results</strong> for <strong>{query || "all programs"}</strong><button onClick={() => notify("Results sorted by relevance")}><SlidersHorizontal size={14} /> Relevance</button></div>
            <div className="result-list">
              {resultRows.slice(0, showAll || searched ? resultRows.length : 3).map((row, index) => (
                <section className={`result-card ${expanded === index ? "is-expanded" : ""}`} key={`${row.program}-${index}`}>
                  <button className="result-head" onClick={() => setExpanded(expanded === index ? null : index)} aria-expanded={expanded === index}>
                    <span className="result-rank">#{index + 1}</span>
                    <strong className="result-program">{row.program}</strong>
                    <span className="match-badge">{row.match}</span>
                    <span className="result-score">Score: {row.score}</span>
                    {expanded === index ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                  </button>
                  {expanded === index && (
                    <div className="result-detail">
                      <div className="result-fields">
                        <div><span>Program</span><strong>INTPOST2</strong></div>
                        <div><span>Technology</span><strong>COBOL</strong></div>
                        <div><span>Score</span><strong>1.0000</strong></div>
                        <div><span>Modernisation risk</span><strong className="risk-badge">Critical</strong></div>
                      </div>
                      <Button onClick={openOverview} className="overview-action">Open Overview for INTPOST2 <ArrowRight size={15} /></Button>
                    </div>
                  )}
                </section>
              ))}
            </div>
            <details className="raw-response"><summary>Raw JSON response</summary><pre>{JSON.stringify({ query, count: 8, program: "INTPOST2", score: 1 }, null, 2)}</pre></details>
          </main>
        </div>
      )}

      {view === "overview" && (
        <div className="workspace overview-workspace">
          <aside className="left-rail overview-rail">
            <button className="back-rail" onClick={() => setView("search")}><ArrowLeft size={15} /> Back</button>
            <nav className="overview-nav" aria-label="Program sections">
              {["Overview", "Business rules", "Dependencies", "Data & SQL", "Source", "History"].map((item) => <button key={item} className={`nav-item ${activeTab === item ? "is-current" : ""}`} onClick={() => setActiveTab(item)}>{item}</button>)}
            </nav>
          </aside>
          <main className="main-content overview-main">
            <button className="inline-back" onClick={() => setView("search")}><ArrowLeft size={15} />Back to search</button>
            <div className="breadcrumbs">Portfolio <ChevronRight size={13} /> Settlement <ChevronRight size={13} /> <strong>INTPOST2</strong></div>
            <div className="program-title"><h1>INTPOST2</h1><span>Interest Posting</span><span className="program-chip"><span className="risk-dot high" /> Critical risk</span></div>
            <nav className="tabs" aria-label="Program details">
              {["Overview", "Business rules", "Dependencies", "Data & SQL", "Source", "History"].map((tab) => <button key={tab} className={activeTab === tab ? "tab is-active" : "tab"} onClick={() => setActiveTab(tab)}>{tab}</button>)}
            </nav>
            {activeTab === "Overview" ? <div className="overview-grid">
              <section className="data-panel paragraphs-panel"><PanelHeading title="Paragraphs" subtitle="Click to open source" /><div className="paragraph-list">{paragraphs.map((p) => <button key={p} className="paragraph-row" onClick={() => { setActiveTab("Source"); notify(`${p} source opened`); }}><strong>{p}</strong><span>PERFORMS</span></button>)}</div></section>
              <section className="data-panel relationships-panel"><PanelHeading title="Relationships" subtitle="Click to drill through" /><div className="relationship-list">{relationships.map(([label, value]) => <button className="relationship-row" key={String(label)} onClick={() => { setQuery(String(label)); openGraph(); }}><span className="relationship-name">{label}</span><span className="bar-track"><span style={{ width: `${Math.max(Number(value) / 82 * 100, 2)}%` }} /></span><span className="relationship-count">{value}</span></button>)}</div></section>
              <section className="data-panel evidence-panel"><PanelHeading title="Evidence" /><pre className="code-evidence">{`PERFORM 0000-MAINLINE\nPERFORM 1000-INITIALIZE\nCALL 'TAXCALC'\nCALL 'CEE3DLY'\nSQL --> INCLUDE\nSQL --> DECLARE`}</pre><div className="evidence-caption">INTPOST2.cbl · Parsed successfully</div><div className="evidence-actions"><Button onClick={openGraph}><Network size={15} />Open in graph</Button><Button variant="outline" onClick={() => notify("Impact analysis is ready")}>Impact analysis</Button><Button variant="outline" onClick={() => notify("Added to modernisation wave")}>Add to wave</Button><Button variant="outline" onClick={() => notify("Flagged for review")}>Flag for review</Button></div></section>
            </div> : <section className="tab-content-panel"><PanelHeading title={activeTab} subtitle="INTPOST2 · Interest Posting" /><p>This program is connected to the settlement processing domain and shares data structures with account, tax, and reconciliation workflows.</p><div className="tab-content-stats"><span><strong>15</strong> paragraphs</span><span><strong>6</strong> copybooks</span><span><strong>23</strong> referenced tables</span></div><Button onClick={openGraph}><Network size={15} />Explore relationships</Button></section>}
          </main>
        </div>
      )}

      {view === "graph" && (
        <div className="workspace graph-workspace">
          <aside className="graph-nav">
            <button className="back-rail" onClick={() => setView("overview")}><ArrowLeft size={15} /> Overview</button>
            {["Graph", "Impact", "Lineage", "Code", "API"].map((item) => <button key={item} className={item === "Graph" ? "graph-nav-item is-current" : "graph-nav-item"} onClick={() => item === "Graph" ? undefined : notify(`${item} view selected`)}>{item}</button>)}
          </aside>
          <aside className="filter-rail">
            <div className="filter-title">Relationship filters <button onClick={() => setEnabledKinds(relationships.map(([name]) => String(name)))}>All</button><button onClick={() => setEnabledKinds([])}>None</button></div>
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
            <div className="graph-stats"><div><strong>15</strong><span>programs<br />impacted</span></div><div><strong>6</strong><span>copybooks</span></div><div><strong>23</strong><span>tables</span></div></div>
            <details className="raw-response graph-raw"><summary>Raw JSON response</summary><pre>{JSON.stringify({ node: selectedNode, relationships: enabledKinds.length, programsImpacted: 15 }, null, 2)}</pre></details>
          </main>
        </div>
      )}
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  );
}

function PanelHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return <div className="panel-heading"><strong>{title}</strong>{subtitle && <span>· {subtitle}</span>}</div>;
}