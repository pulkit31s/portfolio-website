import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dbConnect } from '@/lib/dbConnect';
import Project from '@/lib/models/Project';

export const dynamic = 'force-dynamic';

async function getProject(slug: string) {
  await dbConnect();
  const project = await Project.findOne({ slug }).lean();
  return project ? JSON.parse(JSON.stringify(project)) : null;
}

export default async function ProjectCaseStudy({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#050508] text-white pt-24 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/#projects" className="text-white/40 hover:text-[#00d4ff] transition-colors font-mono text-xs tracking-widest uppercase mb-10 inline-block">
          ← Back to Projects
        </Link>
        
        <header className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border border-[#00d4ff]/30 text-[#00d4ff] bg-[#00d4ff]/10">
              {project.category || 'Project'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono border border-white/10 text-white/60 bg-white/5">
              {project.status}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-6" style={{ fontFamily: "'Courier New', monospace" }}>
            {project.title}
          </h1>
          <p className="text-xl text-white/60 leading-relaxed max-w-3xl">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-white/10">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl text-sm font-mono font-bold text-black bg-[#00d4ff] hover:bg-[#00d4ff]/80 transition-all">
                Live Demo ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl text-sm font-mono text-white bg-white/10 hover:bg-white/20 transition-all">
                GitHub ↗
              </a>
            )}
            {project.documentationUrl && (
              <a href={project.documentationUrl} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl text-sm font-mono text-white/60 border border-white/10 hover:border-white/30 transition-all">
                Documentation
              </a>
            )}
          </div>
        </header>

        {project.imageUrl && (
          <div className="rounded-3xl overflow-hidden border border-white/10 mb-20 bg-white/5 aspect-[21/9]">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-16">
          {/* Main Content */}
          <div className="space-y-16">
            {project.description && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-4">Overview</h2>
                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed font-sans whitespace-pre-wrap">
                  {project.description}
                </div>
              </section>
            )}

            {project.problem && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-4">The Problem</h2>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white/70 leading-relaxed font-sans">
                  {project.problem}
                </div>
              </section>
            )}

            {project.solution && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-4">The Solution</h2>
                <div className="p-6 rounded-2xl bg-[#00d4ff]/5 border border-[#00d4ff]/20 text-white/80 leading-relaxed font-sans">
                  {project.solution}
                </div>
              </section>
            )}

            {project.features?.length > 0 && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-6">Key Features</h2>
                <div className="grid gap-4">
                  {project.features.map((feature: string, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-start gap-4">
                      <span className="text-[#00d4ff] font-mono opacity-50 mt-1">{(i + 1).toString().padStart(2, '0')}</span>
                      <p className="text-white/80">{feature}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {(project.architectureClient || project.architectureApi || project.architectureDb || project.architectureDiagram || project.architectureDescription) && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-6">Architecture</h2>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
                  {project.architectureDiagram && (
                    <div className="mb-8 rounded-xl overflow-hidden bg-black/40 border border-white/10">
                      <img src={project.architectureDiagram} alt="Architecture Diagram" className="w-full h-auto" />
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center justify-center gap-6 text-center font-mono text-sm mb-8">
                    <div className="p-4 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex-1 min-w-[150px]">
                      <div className="font-bold mb-1">Client</div>
                      <div className="text-xs text-white/60">{project.architectureClient || 'N/A'}</div>
                    </div>
                    <span className="text-white/30 hidden md:block">➔</span>
                    <div className="p-4 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex-1 min-w-[150px]">
                      <div className="font-bold mb-1">API</div>
                      <div className="text-xs text-white/60">{project.architectureApi || 'N/A'}</div>
                    </div>
                    <span className="text-white/30 hidden md:block">➔</span>
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex-1 min-w-[150px]">
                      <div className="font-bold mb-1">Database</div>
                      <div className="text-xs text-white/60">{project.architectureDb || 'N/A'}</div>
                    </div>
                  </div>

                  {project.architectureDescription && (
                    <p className="text-white/60 text-sm leading-relaxed text-center max-w-2xl mx-auto">
                      {project.architectureDescription}
                    </p>
                  )}
                </div>
              </section>
            )}

            {project.gallery?.length > 0 && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.gallery.map((img: string, i: number) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-white/10 aspect-video bg-white/5">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.contributions?.length > 0 && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-6">My Contributions</h2>
                <ul className="space-y-3">
                  {project.contributions.map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-white/70">
                      <span className="text-[#00d4ff] mt-1">✓</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {project.learnings && (
              <section>
                <h2 className="text-sm font-mono text-[#00d4ff] uppercase tracking-widest mb-4">What I Learned</h2>
                <div className="p-6 rounded-2xl border border-white/10 text-white/70 leading-relaxed italic">
                  "{project.learnings}"
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            {project.techStack?.length > 0 && (
              <div>
                <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 rounded text-xs font-mono bg-white/5 border border-white/10 text-white/80">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.tags?.length > 0 && (
              <div>
                <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.metrics?.length > 0 && (
              <div>
                <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Metrics</h3>
                <div className="space-y-4">
                  {project.metrics.filter((m: any) => m.visible).map((metric: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-2xl font-black text-[#00d4ff] mb-1 font-mono">{metric.value}</div>
                      <div className="text-xs text-white uppercase tracking-widest font-bold mb-1">{metric.label}</div>
                      {metric.description && <div className="text-xs text-white/40">{metric.description}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
