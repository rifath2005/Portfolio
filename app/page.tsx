import Navbar from "@/components/Navbar";
import HeroScene from "@/components/HeroScene";
import DraggableBulb from "@/components/DraggableBulb";
import HeroText from "@/components/HeroText";
import ScrollRevealText from "@/components/ScrollRevealText";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ProjectCard from "@/components/ProjectCard";
import SkillsSolarSystem from "@/components/SkillsSolarSystem";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

const projects: any[] = [
  {
    title: "AUTOMATION IN MCP",
    subtitle: "Built automated workflows using MCP Servers with Cursor IDE.",
    tags: ["MCP Servers", "Cursor IDE", "Pipedream", "Node.js"],
    metrics: [
      { value: 60, suffix: "%", label: "Time Saved" },
      { value: 100, suffix: "%", label: "Automated" }
    ],
    type: "flow",
    problem: "Engineering workflows involved heavy context switching between the code editor and external tools, which reduced development speed and created integration bottlenecks.",
    approach: "Engineered custom Model Context Protocol (MCP) servers integrated with Cursor IDE and orchestrated via Pipedream. This enabled intelligent, direct tool-use by the LLM to streamline task execution.",
    outcome: "Achieved 100% automation of targeted orchestration tasks and reduced overall task execution time by 60%, drastically minimizing context switching and accelerating development.",
    architecture: {
      nodes: [
        { id: "webhook", position: [-3, 0, 0], label: "Webhook Receiver", shape: "box", metric: "20ms" },
        { id: "queue", position: [-1.5, 0, 1], label: "Event Queue", shape: "box", metric: "0ms" },
        { id: "processor", position: [0.5, 0.5, -0.5], label: "LLM Processor", shape: "icosahedron", metric: "1.2s" },
        { id: "db", position: [2.5, 1, 0.5], label: "Vector DB", shape: "sphere", metric: "15ms" },
        { id: "output", position: [2.5, -1, 0.5], label: "Output Sync", shape: "box", metric: "50ms" }
      ],
      connections: [
        { source: "webhook", target: "queue", curveHeight: 0.5 },
        { source: "queue", target: "processor", curveHeight: 1 },
        { source: "processor", target: "db", curveHeight: 0.5 },
        { source: "processor", target: "output", curveHeight: -0.5 }
      ]
    }
  },
  {
    title: "NOTINQ CMS",
    subtitle: "Developed a QR-based ordering and payment system enabling users to pre-order food.",
    tags: ["Node.js", "JavaScript", "SQL", "HTML/CSS"],
    metrics: [
      { value: 15, suffix: "m", label: "Wait Time Eliminated" },
      { value: 500, prefix: "+", label: "Daily Users" }
    ],
    type: "grid",
    problem: "Canteen users faced significant wait times during peak hours, while manual ordering processes caused bottlenecks, payment friction, and operational inefficiencies for the staff.",
    approach: "Developed a full-stack digital management system utilizing Node.js and SQL. Engineered a QR-based pre-ordering workflow with integrated payment gateways to bypass physical queues.",
    outcome: "Scaled the platform to support 500+ daily active users and completely eliminated the average 15-minute queue wait time, providing a frictionless transaction experience."
  },
  {
    title: "LEGAL GRAPHRAG",
    subtitle: "Intelligent platform aggregating and analyzing US and Indian court data.",
    tags: ["Python", "FastAPI", "RAG", "Vector DB"],
    metrics: [
      { value: 99, suffix: "%", label: "Retrieval Accuracy" },
      { value: 10, suffix: "k+", label: "Cases Indexed" }
    ],
    type: "shatter",
    problem: "Legal professionals struggle to quickly find and synthesize relevant case law across jurisdictions due to massive, unstructured document repositories and poor traditional search algorithms.",
    approach: "Designed a scalable architecture using Python and FastAPI to ingest court data. Built a high-performance Retrieval-Augmented Generation (RAG) pipeline supported by a vector database for semantic search.",
    outcome: "Successfully indexed over 10,000 cases into the system and achieved a 99% retrieval accuracy rate, delivering highly contextual, citation-grounded analysis with minimal latency."
  }
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-hidden bg-bg">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen w-full" id="hero">
        <HeroScene />
        <DraggableBulb />
        <HeroText />
      </section>

      {/* About Section */}
      <section className="relative min-h-screen flex flex-col justify-center px-8 md:px-[10%] py-32" id="about">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-sm font-mono tracking-widest text-accent mb-8">CHAPTER 01 — ABOUT</h2>
          <ScrollRevealText 
            className="text-2xl md:text-4xl lg:text-5xl font-medium leading-[1.2] md:leading-[1.2] lg:leading-[1.2]"
            text={`Creating seamless, highly interactive web applications.\nThe interface shouldn't just look good; it should feel effortless.\n\nBuilding robust server-side applications and RESTful APIs.\nDesigning optimized SQL databases capable of high-throughput queries with millisecond latency.\n\nIntegrating NLP and machine learning to automate workflows.\nOrchestrating pipelines and building systems that adapt to user behavior.`} 
          />
        </div>
      </section>

      {/* Experience Section */}
      <section className="relative min-h-screen px-8 md:px-[10%] py-32 bg-bg-alt/50" id="experience">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-sm font-mono tracking-widest text-accent mb-4">CHAPTER 02 — EXPERIENCE</h2>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight">A trajectory that earns its momentum.</h3>
        </div>
        <ExperienceTimeline />
      </section>
      
      <SectionDivider />

      {/* Works Section */}
      <section className="relative min-h-screen px-8 md:px-[10%] py-32" id="works">
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-sm font-mono tracking-widest text-accent mb-4">CHAPTER 03 — SELECTED WORKS</h2>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl">Engineering solutions without compromises.</h3>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col gap-8 md:gap-16">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* Skills / Architecture Section */}
      <section className="relative min-h-[100vh] px-8 md:px-[10%] py-32 bg-bg-alt/50" id="skills">
        <div className="max-w-6xl mx-auto mb-16 text-center">
          <h2 className="text-sm font-mono tracking-widest text-accent mb-4">CHAPTER 04 — ECOSYSTEM</h2>
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight">The stack that powers the intelligence.</h3>
        </div>
        <div className="max-w-6xl mx-auto">
          <SkillsSolarSystem />
        </div>
      </section>

      <SectionDivider />

      <Footer />
    </main>
  );
}
