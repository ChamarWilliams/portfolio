"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Art } from "@/components/Art";

export type ProjectSummary = {
    slug: string;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    link: string;
    linkLabel: string;
};

const SECTIONS = [
    { id: "home", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
];

const FOCUS = [
    { n: "i", title: "Netcode that holds up under lag", body: "Combat validated against tick-indexed server snapshots, with rate-limiting and lag compensation benchmarked under simulated ping." },
    { n: "ii", title: "Evaluations that catch real failures", body: "Docker-run model evaluations on real repositories, structured failure-mode analysis, and datasets with planted traps." },
    { n: "iii", title: "Tools for people who build", body: "Arboryn merges Roblox object trees, and Trefelle gives engineers a practice space with real code execution and bring-your-own AI." },
];

const JOBS = [
    { title: "Data Annotation Tech", when: "AI Model Evaluator, Software Engineering · Jul 2026 - Present · Remote", bullets: [
        "Configured Docker environments to run AI models against open-source repositories, enabling reproducible evaluation across codebases.",
        "Ran model inference and captured execution traces to compare outputs against expected behavior.",
        "Documented model errors with structured failure-mode analysis and recommended corrections.",
        "Built evaluation datasets and grading rubrics for AI agents, including multi-file synthetic corpora with planted traps across finance, legal, and engineering domains.",
    ] },
    { title: "Handshake AI", when: "Data Annotator, contract · Nov 2025 - Present · Remote", bullets: [
        "Labeled and rated AI model outputs, including images, against task guidelines.",
        "Reviewed AI-generated code and documented issues to support model improvement.",
    ] },
    { title: "Concilio", when: "Digital Media Specialist · Jun - Sep 2023 · Philadelphia, PA", bullets: [
        "Mentored digital media cohorts across 2 summers and trained users on operating systems and networks.",
        "Resolved escalated technical issues through proactive troubleshooting to minimize downtime.",
    ] },
    { title: "Johnson Real Estate", when: "Apprentice · Jun 2022 - Dec 2024", bullets: [
        "Managed multiple property portfolios and client communication.",
    ] },
];

const SKILLS = [
    { title: "Languages", items: ["Python", "SQL", "TypeScript", "JavaScript", "HTML/CSS", "C", "C++", "C#", "Lua/Luau"] },
    { title: "AI and evaluation", items: ["LLM and agent evaluation", "Rubric design", "Adversarial datasets", "Failure-mode analysis"] },
    { title: "Engineering", items: ["Git/GitHub", "Docker", "Linux", "Node.js", "Supabase", "Vercel", "REST APIs", "Client-server architecture", "Debugging"] },
];

export const Home = ({ projects }: { projects: ProjectSummary[] }) => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        let frame = 0;
        const spy = () => {
            frame = 0;
            const y = window.scrollY + window.innerHeight * 0.4;
            let cur = 0;
            SECTIONS.forEach((s, i) => {
                const el = document.getElementById(s.id);
                if (el && el.offsetTop <= y) cur = i;
            });
            setActive(cur);
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(spy); };
        spy();
        window.addEventListener("scroll", onScroll, { passive: true });

        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add("e-in"); io.unobserve(e.target); }
            }),
            { threshold: 0.12 },
        );
        document.querySelectorAll(".e-reveal").forEach((el) => io.observe(el));

        return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); io.disconnect(); };
    }, []);

    return (
        <>
            <nav className="e-trail" aria-label="Sections">
                {SECTIONS.map((s, i) => (
                    <a key={s.id} href={`#${s.id}`} className={i === active ? "on" : ""}><i />{s.label}</a>
                ))}
            </nav>

            <main className="e-main">
                <section id="home" className="e-sec e-hero">
                    <div>
                        <div className="e-eyebrow">Software engineering student · Temple University</div>
                        <h1 className="e-h1">Netcode, developer tools, and <em>AI evaluation.</em></h1>
                        <p className="e-lede">I build multiplayer netcode, developer tools, and evaluation pipelines for AI systems. Every project below has a demo you can use.</p>
                        <div className="e-btns">
                            <a className="e-btn e-fill" href="#projects">See projects</a>
                            <a className="e-btn e-line" href="/assets/Chamar_Williams_Resume.pdf">Resume</a>
                            <a className="e-btn e-line" href="https://github.com/ChamarWilliams" target="_blank" rel="noopener noreferrer">GitHub</a>
                        </div>
                    </div>
                    <svg className="e-constel" viewBox="0 0 420 420" aria-hidden="true">
                        <line x1="210" y1="210" x2="82" y2="96" /><line x1="210" y1="210" x2="348" y2="118" />
                        <line x1="210" y1="210" x2="330" y2="330" /><line x1="210" y1="210" x2="92" y2="320" />
                        <line x1="82" y1="96" x2="348" y2="118" style={{ opacity: 0.35 }} /><line x1="92" y1="320" x2="330" y2="330" style={{ opacity: 0.35 }} />
                        {[[82, 96, "Netcode", 140], [348, 118, "Dev tools", 162], [330, 330, "AI evaluation", 374], [92, 320, "Roblox", 364]].map(([x, y, label, ty]) => (
                            <g className="sat" key={String(label)}>
                                <circle className="r" cx={x as number} cy={y as number} r="24" />
                                <circle className="d" cx={x as number} cy={y as number} r="5" />
                                <text x={x as number} y={ty as number}>{label}</text>
                            </g>
                        ))}
                        <circle cx="210" cy="210" r="50" fill="#111" /><text className="core" x="210" y="221">CW</text>
                        <circle cx="30" cy="210" r="4" fill="#b8893a" /><circle cx="395" cy="230" r="3.5" fill="#b8893a" /><circle cx="215" cy="30" r="3.5" fill="#b8893a" />
                    </svg>
                </section>

                <div className="e-focus e-reveal">
                    {FOCUS.map((f) => (
                        <div className="e-f" key={f.n}><i>{f.n}</i><h3>{f.title}</h3><p>{f.body}</p></div>
                    ))}
                </div>

                <section id="projects" className="e-sec">
                    <div className="e-eyebrow e-reveal"><b>01</b>Selected work</div>
                    <h2 className="e-h2 e-reveal">Projects</h2>
                    <div className="e-grid">
                        {projects.map((p) => (
                            <article className="e-card e-reveal" key={p.slug}>
                                <Link href={`/work/${p.slug}`} className="e-art" aria-label={`${p.title}: learn more`}><Art kind={p.slug} /></Link>
                                <div className="e-in">
                                    <div className="e-num">{p.category}</div>
                                    <h3>{p.title}</h3>
                                    <p>{p.summary}</p>
                                    <div className="e-tags">{p.tags.map((t) => <span className="e-tag" key={t}>{t}</span>)}</div>
                                    <div className="e-links">
                                        <Link href={`/work/${p.slug}`}>Learn more →</Link>
                                        {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">{p.linkLabel || "Visit"}</a>}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="experience" className="e-sec">
                    <div className="e-eyebrow e-reveal"><b>02</b>Where I&apos;ve worked</div>
                    <h2 className="e-h2 e-reveal">Experience</h2>
                    <div className="e-tl">
                        {JOBS.map((j) => (
                            <div className="e-job e-reveal" key={j.title}>
                                <h3>{j.title}</h3>
                                <div className="e-when">{j.when}</div>
                                <ul>{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="about" className="e-sec">
                    <div className="e-eyebrow e-reveal"><b>03</b>Background</div>
                    <h2 className="e-h2 e-reveal">About</h2>
                    <div className="e-about e-reveal">
                        <img className="e-avatar" src="/images/avatar.jpg" alt="Chamar Williams" />
                        <div>
                            <p>I&apos;m a computer science student at Temple University in Philadelphia. At work, I test how AI models fail on real code and turn those failures into datasets and rubrics.</p>
                            <div className="e-studies"><span>Temple University · B.S. Computer Science, 78 credits completed, 14 in progress</span><span>Community College of Philadelphia · A.S. Computer Science</span></div>
                            <div className="e-studies" style={{ marginTop: 14 }}><span>Data Structures and Algorithms</span><span>Systems Programming (C)</span><span>Operating Systems</span><span>Probability and Statistics</span></div>
                        </div>
                    </div>
                    <div className="e-skills">
                        {SKILLS.map((s) => (
                            <div className="e-skill e-reveal" key={s.title}>
                                <h4>{s.title}</h4>
                                <div className="e-chips">{s.items.map((i) => <span key={i}>{i}</span>)}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="contact" className="e-sec">
                    <div className="e-cta e-reveal">
                        <div className="e-eyebrow">Get in touch</div>
                        <h2 className="e-h2">Let&apos;s build something.</h2>
                        <p>Reach out about roles, projects, or collaboration.</p>
                        <div className="e-btns" style={{ justifyContent: "center" }}>
                            <a className="e-btn e-fill" href="mailto:Chamarwilliams05@gmail.com">Email me</a>
                            <a className="e-btn e-line" href="https://github.com/ChamarWilliams" target="_blank" rel="noopener noreferrer">GitHub</a>
                            <a className="e-btn e-line" href="/assets/Chamar_Williams_Resume.pdf">Resume</a>
                        </div>
                    </div>
                    <footer className="e-foot"><span>© 2026 Chamar Williams</span><span>Philadelphia, PA</span></footer>
                </section>
            </main>
        </>
    );
};
