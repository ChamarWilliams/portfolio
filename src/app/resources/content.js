import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Chamar',
    lastName:  'Williams',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role:      'Software Engineering Student',
    avatar:    '/images/avatar.jpg',
    location:  'America/New_York',   // IANA time zone identifier
    languages: []                    // optional: leave empty to hide
}

const newsletter = {
    display: false,
    title: <>Subscribe to {person.firstName}'s Newsletter</>,
    description: <>Not in use.</>
}

const social = [
    {
        name: 'GitHub',
        icon: 'github',
        link: 'https://github.com/ChamarWilliams',
    },
    {
        name: 'Resume',
        icon: 'book',
        link: '/assets/Chamar_Williams_Resume.pdf',
    },
    {
        name: 'LinkedIn',
        icon: 'linkedin',
        link: '',   // add your LinkedIn URL here to show it
    },
    {
        name: 'Email',
        icon: 'email',
        link: 'mailto:Chamarwilliams05@gmail.com',
    },
]

const home = {
    label: 'Home',
    title: `${person.name} | Software Engineering Student`,
    description: `Portfolio of ${person.name}: multiplayer netcode, developer tools, and AI evaluation work.`,
    headline: <>Netcode, developer tools, and AI evaluation</>,
    subline: <>I'm Chamar, a computer science student at <InlineCode>Temple University</InlineCode>. I build multiplayer netcode, developer tools, and evaluation pipelines for AI systems. Every project below has a demo you can use.</>
}

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} in Philadelphia`,
    tableOfContent: {
        display: true,
        subItems: false
    },
    avatar: {
        display: true
    },
    calendar: {
        display: false,
        link: ''
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>I am a computer science student at Temple University in Philadelphia. I build multiplayer netcode for Roblox games, developer tools, and evaluation pipelines for AI systems. At work I test how AI models fail on real code, and I turn those failures into datasets and rubrics.</>
    },
    work: {
        display: true,
        title: 'Work Experience',
        experiences: [
            {
                company: 'Data Annotation Tech',
                timeframe: 'Jul 2026 - Present',
                role: 'AI Model Evaluator (Software Engineering)',
                achievements: [
                    <>Run AI models against open-source repositories in Docker and capture execution traces to compare their output with expected behavior.</>,
                    <>Document model errors with structured failure-mode analysis and recommended corrections.</>,
                    <>Build evaluation datasets and grading rubrics for AI agents, including multi-file synthetic corpora with planted traps across finance, legal, and engineering domains.</>
                ],
                images: []
            },
            {
                company: 'Handshake AI',
                timeframe: 'Nov 2025 - Present',
                role: 'Data Annotator (contract)',
                achievements: [
                    <>Rate AI model outputs, including images, against task guidelines.</>,
                    <>Review AI-generated code and document issues to support model improvement.</>
                ],
                images: []
            },
            {
                company: 'Concilio',
                timeframe: 'Jun 2023 - Sep 2023',
                role: 'Digital Media Specialist',
                achievements: [
                    <>Mentored digital media cohorts across 2 summers and trained users on operating systems and networks.</>,
                    <>Resolved escalated technical issues through proactive troubleshooting to minimize downtime.</>
                ],
                images: []
            }
        ]
    },
    studies: {
        display: true,
        title: 'Studies',
        institutions: [
            {
                name: 'Temple University',
                description: <>B.S. in Computer Science, in progress.</>,
            },
            {
                name: 'Community College of Philadelphia',
                description: <>A.S. in Computer Science.</>,
            }
        ]
    },
    technical: {
        display: true,
        title: 'Technical skills',
        skills: [
            {
                title: 'Netcode and client-server design',
                description: <>Combat validation against tick-indexed server snapshots, state replication, rate-limiting, and lag compensation in Luau.</>,
                images: []
            },
            {
                title: 'AI evaluation',
                description: <>Docker-based model runs against real repositories, grading rubrics, adversarial datasets, and a vision-language-model judge built in Python.</>,
                images: []
            },
            {
                title: 'Web development',
                description: <>JavaScript, HTML, and CSS applications. Trefelle uses Supabase auth and deploys on Vercel.</>,
                images: []
            },
            {
                title: 'Languages and tools',
                description: <>Python, SQL, TypeScript, JavaScript, C, C++, C#, Luau, Git, Docker, and Linux.</>,
                images: []
            }
        ]
    }
}

const blog = {
    label: 'Blog',
    title: 'Writing',
    description: `Notes by ${person.name}`
}

const work = {
    label: 'Work',
    title: 'Projects',
    description: `Projects by ${person.name}`
}

const gallery = {
    label: 'Gallery',
    title: 'Gallery',
    description: `Photos by ${person.name}`,
    /** @type {{src: string, alt: string, orientation: string}[]} */
    images: []
}

export { person, social, newsletter, home, about, blog, work, gallery };
