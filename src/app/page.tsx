import Link from "next/link";
import { Sparkles, BookOpen, Brain, PenTool, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const TOOLS = [
    {
      title: "Letras",
      description: "Master the Ancient Greek alphabet with interactive drills.",
      icon: <Sparkles className="w-6 h-6" />,
      href: "/letras",
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Memory",
      description: "Match letters, names, and symbols in this classical game.",
      icon: <Brain className="w-6 h-6" />,
      href: "/memory",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Vocabulario",
      description: "Master the most frequent words in Ancient Greek literature.",
      icon: <Brain className="w-6 h-6" />,
      href: "/vocabulario",
      color: "bg-emerald-500/10 text-emerald-500",
    },
    {
      title: "Lectura",
      description: "Practice reading classical texts with assistant tools.",
      icon: <BookOpen className="w-6 h-6" />,
      href: "/lectura",
      color: "bg-purple-500/10 text-purple-500",
    },
  ];

  return (
    <div className="flex flex-col items-center pt-20 pb-32">
      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center space-y-8 mb-24 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Languages className="w-3 h-3" />
          <span>Classical Philology Tools</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          Master the Language of <br />
          <span className="text-gradient">Philosophers & Poets</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          A suite of modern tools designed to help you learn, read, and write 
          Ancient Greek with precision and beauty.
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
          <Link href="/memory">
            <button className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
              Get Started
            </button>
          </Link>
          <Link href="/letras">
            <button className="px-8 py-4 glass font-bold rounded-2xl hover:bg-accent transition-all">
              Explore Tools
            </button>
          </Link>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TOOLS.map((tool, i) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group relative p-8 glass rounded-3xl hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              {tool.icon}
            </div>
            
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", tool.color)}>
              {tool.icon}
            </div>
            
            <h3 className="text-xl font-bold mb-3">{tool.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {tool.description}
            </p>
            
            <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              Try Now →
            </div>
          </Link>
        ))}
      </section>

      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
