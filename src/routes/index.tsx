import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clipboard,
  Download,
  FileText,
  FolderKanban,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas Research — Multi-Agent Research Assistant" },
      { name: "description", content: "Turn complex questions into sourced, reviewed research reports with a four-agent AI pipeline." },
      { property: "og:title", content: "Atlas Research — Multi-Agent Research Assistant" },
      { property: "og:description", content: "Turn complex questions into sourced, reviewed research reports with a four-agent AI pipeline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchApp,
});

type View = "home" | "pipeline" | "report";
type AgentStatus = "pending" | "running" | "done";

const examples = [
  "What is RLVR?",
  "How will small language models evolve?",
  "Compare RAG and long-context retrieval",
];

const agents = [
  { name: "Planner", icon: FolderKanban, detail: "Decomposing the research problem", output: "5 targeted sub-questions mapped across definition, architecture, applications, comparisons, and limitations." },
  { name: "Researcher", icon: Search, detail: "Searching and validating sources", output: "5 findings synthesized from technical papers, model documentation, and industry analysis." },
  { name: "Writer", icon: FileText, detail: "Structuring the evidence", output: "Drafted an 8-section report with inline citations, takeaways, and a reference list." },
  { name: "Reviewer", icon: Sparkles, detail: "Scoring accuracy and completeness", output: "Approved after 1 review round. Evidence coverage: strong. Final score: 9/10." },
];

const report = `## Executive Summary

Reinforcement Learning with Verifiable Rewards (RLVR) is a training approach that improves language models using rewards that can be checked automatically. Instead of relying only on subjective human preferences, RLVR evaluates outputs against objective criteria such as a correct answer, executable code, or a valid proof [1].

## Background

Traditional reinforcement learning from human feedback depends on learned reward models. RLVR replaces or supplements those models with programmatic verifiers, making the reward signal cheaper, more consistent, and harder to misinterpret for tasks with clear outcomes [2].

## 1. Core Definition

RLVR fine-tunes a model by sampling candidate answers, checking each answer with a deterministic or learned verifier, and reinforcing successful reasoning paths. The training loop resembles:

\`\`\`python
response = policy.sample(problem)
reward = verifier(problem, response)
policy.update(response, reward)
\`\`\`

## 2. System Architecture

A typical system combines a policy model, task sampler, rollout engine, verifier, and reinforcement-learning optimizer. The verifier may check final answers, execute tests, compare structured outputs, or validate formal proofs [3].

## 3. Applications

RLVR is especially effective in mathematics, code generation, logic puzzles, and scientific reasoning—domains where correctness can be measured without asking a human to judge every response.

## 4. RLVR Compared with RLHF

RLHF captures nuanced human preferences but can be expensive and inconsistent. RLVR offers a precise, scalable reward for verifiable tasks. In practice, strong systems can combine both: objective verification for correctness and human preference signals for usefulness and style [4].

## 5. Current Limitations

The method depends on reliable verifiers. A narrow or exploitable verifier can reward shortcuts rather than genuine reasoning. RLVR also applies less naturally to open-ended writing, strategy, and taste-based judgments where no single answer is objectively correct [5].

## Challenges

The major research challenge is preventing reward hacking while expanding verification beyond domains with simple final-answer checks. Process-level verification and diverse test generation are promising directions.

## Key Takeaways

- ✓ RLVR uses automatically checkable rewards to train reasoning models.
- ✓ It scales well in mathematics, coding, and other objective domains.
- ✓ Verifier quality determines the quality of the learned behavior.
- ✓ RLVR complements rather than universally replaces human feedback.

## References

1. [DeepSeek-R1: Incentivizing Reasoning Capability](https://arxiv.org/abs/2501.12948)
2. [Training Verifiers to Solve Math Word Problems](https://arxiv.org/abs/2110.14168)
3. [Let’s Verify Step by Step](https://arxiv.org/abs/2305.20050)
4. [Learning to Summarize from Human Feedback](https://arxiv.org/abs/2009.01325)
5. [Specification Gaming: The Flip Side of AI Ingenuity](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)`;

function ResearchApp() {
  const [view, setView] = useState<View>("home");
  const [query, setQuery] = useState("What is RLVR?");
  const [activeAgent, setActiveAgent] = useState(-1);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (view !== "pipeline") return;
    setActiveAgent(0);
    const timers = agents.map((_, index) =>
      window.setTimeout(() => {
        if (index === agents.length - 1) {
          setActiveAgent(agents.length);
          window.setTimeout(() => setView("report"), 900);
        } else {
          setActiveAgent(index + 1);
        }
      }, 1500 * (index + 1)),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [view]);

  const resizeTextarea = () => {
    const field = textareaRef.current;
    if (!field) return;
    field.style.height = "0px";
    field.style.height = `${Math.min(field.scrollHeight, 180)}px`;
  };

  const beginResearch = () => {
    if (!query.trim()) return;
    setActiveAgent(-1);
    setView("pipeline");
  };

  const copyReport = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const url = URL.createObjectURL(new Blob([report], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "rlvr-research-report.md";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="research-grid relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-px bg-primary/70 shadow-[0_0_28px_var(--glow-primary-strong)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_30%,var(--glow-primary),transparent_38%)]" />
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-border/70 bg-background/80 px-5 backdrop-blur-md sm:px-8">
        <button className="flex items-center gap-3" onClick={() => setView("home")} aria-label="Go to research home">
          <span className="grid size-7 place-items-center border border-primary/70 bg-primary/10 font-mono text-xs text-primary">A</span>
          <span className="font-mono text-sm font-semibold uppercase tracking-widest">Atlas Research</span>
        </button>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Four-agent intelligence system // online</span>
      </header>

      <AnimatePresence mode="wait">
        {view === "home" && <HomeView key="home" query={query} setQuery={setQuery} beginResearch={beginResearch} resizeTextarea={resizeTextarea} textareaRef={textareaRef} />}
        {view === "pipeline" && <PipelineView key="pipeline" query={query} activeAgent={activeAgent} />}
        {view === "report" && <ReportView key="report" query={query} copied={copied} copyReport={copyReport} downloadReport={downloadReport} reset={() => setView("home")} />}
      </AnimatePresence>
    </main>
  );
}

function HomeView({ query, setQuery, beginResearch, resizeTextarea, textareaRef }: { query: string; setQuery: (value: string) => void; beginResearch: () => void; resizeTextarea: () => void; textareaRef: React.RefObject<HTMLTextAreaElement | null> }) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col items-center justify-center px-5 py-16">
      <div className="mb-7 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">&lt;system::research_protocol&gt;</div>
      <div className="mb-4 flex items-center gap-4">
        <h1 className="text-balance text-center font-mono text-3xl font-medium sm:text-5xl">What should we investigate?</h1>
        <span className="hidden h-11 w-4 animate-pulse bg-primary sm:block" />
      </div>
      <p className="mb-10 max-w-xl text-center text-base leading-7 text-muted-foreground">Ask a complex question. Four specialized agents will plan, investigate, write, and verify the answer.</p>

      <div className="glass-panel w-full border border-border p-3 shadow-[0_0_0_1px_var(--glow-primary)] focus-within:border-primary/80 focus-within:shadow-[0_0_36px_var(--glow-primary-strong)] sm:p-4">
        <label htmlFor="research-query" className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"><Search className="size-3" /> Enter research target</label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <textarea id="research-query" ref={textareaRef} rows={1} value={query} onChange={(event) => { setQuery(event.target.value); resizeTextarea(); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); beginResearch(); } }} placeholder="Ask anything — e.g. What is RLVR?" className="min-h-14 flex-1 resize-none border border-input bg-background/60 px-4 py-4 text-base text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-hidden" />
          <Button variant="research" size="lg" onClick={beginResearch} disabled={!query.trim()} className="h-14 px-7 font-mono text-xs uppercase tracking-wider">Research <Send /></Button>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {examples.map((example) => <button key={example} onClick={() => setQuery(example)} className="border border-border bg-card/70 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground">{example}</button>)}
      </div>
      <div className="mt-12 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"><span className="size-1.5 bg-primary" /> Sources checked · Claims reviewed · Markdown ready</div>
    </motion.section>
  );
}

function PipelineView({ query, activeAgent }: { query: string; activeAgent: number }) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="relative z-10 mx-auto w-full max-w-3xl px-5 py-12 sm:py-16">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">Research sequence // active</p>
      <h1 className="text-balance font-mono text-2xl font-semibold sm:text-4xl">{query}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Each agent passes verified context to the next stage.</p>

      <div className="relative mt-10 space-y-4 before:absolute before:bottom-8 before:left-[27px] before:top-8 before:w-px before:bg-border sm:before:left-[35px]">
        {agents.map((agent, index) => {
          const status: AgentStatus = activeAgent > index ? "done" : activeAgent === index ? "running" : "pending";
          return <AgentCard key={agent.name} agent={agent} status={status} index={index} />;
        })}
      </div>
    </motion.section>
  );
}

function AgentCard({ agent, status, index }: { agent: (typeof agents)[number]; status: AgentStatus; index: number }) {
  const [open, setOpen] = useState(false);
  const Icon = agent.icon;
  const done = status === "done";
  return (
    <motion.article initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.12 }} className={cn("glass-panel relative border p-4 transition-all sm:p-5", status === "running" ? "border-primary/70 shadow-[0_0_28px_var(--glow-primary)]" : "border-border")}>
      <div className="flex items-center gap-4">
        <div className={cn("relative z-10 grid size-11 shrink-0 place-items-center border bg-background sm:size-14", done ? "border-success/60 text-success" : status === "running" ? "border-primary text-primary" : "border-border text-muted-foreground")}><Icon className="size-5" /></div>
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h2 className="font-mono text-sm font-semibold uppercase tracking-wider">{agent.name}</h2><StatusBadge status={status} /></div><p className="mt-1 truncate text-sm text-muted-foreground">{agent.detail}</p></div>
        {done && <button onClick={() => setOpen(!open)} className="grid size-9 place-items-center text-muted-foreground hover:text-foreground" aria-label={`${open ? "Hide" : "Show"} ${agent.name} output`}><ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} /></button>}
      </div>
      <AnimatePresence>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="mt-4 border-t border-border pt-4 font-mono text-xs leading-6 text-muted-foreground">&gt; {agent.output}</p></motion.div>}</AnimatePresence>
    </motion.article>
  );
}

function StatusBadge({ status }: { status: AgentStatus }) {
  return <span className={cn("inline-flex items-center gap-2 border px-2 py-1 font-mono text-[9px] uppercase tracking-wider", status === "done" ? "border-success/30 text-success" : status === "running" ? "border-primary/40 text-primary" : "border-border text-muted-foreground")}><span className={cn("size-1.5", status === "done" ? "bg-success" : status === "running" ? "animate-pulse bg-primary" : "bg-muted-foreground/50")} />{status}</span>;
}

function ReportView({ query, copied, copyReport, downloadReport, reset }: { query: string; copied: boolean; copyReport: () => void; downloadReport: () => void; reset: () => void }) {
  return (
    <motion.section initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
      <Button variant="ghost" onClick={reset} className="mb-8 px-0 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:bg-transparent hover:text-foreground"><ArrowLeft /> Research again</Button>
      <div className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-success">Report approved // final</p><h1 className="text-balance font-mono text-3xl font-semibold sm:text-5xl">{query}</h1></div>
        <ScoreBadge />
      </div>
      <div className="flex flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">{["5 sub-questions", "5 findings", "1 review round"].map((stat) => <span key={stat} className="border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase text-muted-foreground">{stat}</span>)}</div>
        <div className="flex gap-2"><Button variant="terminal" onClick={copyReport}>{copied ? <Check /> : <Clipboard />}{copied ? "Copied!" : "Copy report"}</Button><Button variant="research" onClick={downloadReport}><Download /> Download .md</Button></div>
      </div>
      <article className="glass-panel mt-8 border border-border px-5 py-8 sm:px-10 sm:py-12">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
          h2: ({ children }) => <h2 className="mb-5 mt-12 border-b border-border pb-3 font-mono text-xl font-semibold first:mt-0 sm:text-2xl">{children}</h2>,
          p: ({ children }) => <p className="mb-5 text-[15px] leading-8 text-foreground/85">{children}</p>,
          ul: ({ children }) => <ul className="mb-6 space-y-3 text-[15px] leading-7 text-foreground/85">{children}</ul>,
          li: ({ children }) => <li className="ml-5 list-disc marker:text-primary">{children}</li>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" title={href} className="border-b border-primary/50 font-mono text-xs text-primary transition-colors hover:border-primary">{children}</a>,
          code: ({ className, children }) => className ? <code className={className}>{children}</code> : <code className="border border-border bg-background px-1.5 py-0.5 font-mono text-xs text-info">{children}</code>,
          pre: ({ children }) => <pre className="mb-7 overflow-x-auto border border-border bg-background p-5 font-mono text-sm leading-7 text-info">{children}</pre>,
        }}>{report}</ReactMarkdown>
      </article>
    </motion.section>
  );
}

function ScoreBadge() {
  return <div className="flex items-center gap-3"><div className="grid size-20 place-items-center rounded-full border border-success/50 bg-success/5 shadow-[0_0_30px_color-mix(in_oklab,var(--success)_14%,transparent)]"><div className="text-center"><strong className="block font-mono text-xl text-success">9/10</strong><span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">Score</span></div></div></div>;
}
