import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Experience from '@/lib/models/Experience';

export const dynamic = 'force-dynamic';

const initialExperiences = [
  {
    role: 'Full Stack Development Intern',
    company: 'Religare Broking Limited',
    shortName: 'RBL',
    type: 'internship',
    location: 'Noida / New Delhi, India',
    startDate: 'May 2026',
    endDate: 'Jun 2026',
    current: false,
    featured: true,
    status: 'published',
    order: 1,
    bullets: [
      'Automated and validated end-to-end trading application user flows using Maestro and Flutter for cross-platform reliability.',
      'Developed and integrated full-stack API services ensuring high throughput, data integrity, and sub-second execution.',
      'Collaborated with engineering teams to enhance testing automation and feature delivery pipelines across staging and production.',
    ],
    techStack: ['Flutter', 'Maestro', 'Node.js', 'REST APIs', 'Full Stack Automation'],
  },
  {
    role: 'Summer Research Industrial Intern',
    company: 'Vellore Institute of Technology, Chennai',
    shortName: 'VIT',
    type: 'research',
    location: 'Chennai, India',
    startDate: 'May 2025',
    endDate: 'Jul 2025',
    current: false,
    featured: true,
    status: 'published',
    order: 2,
    bullets: [
      'Trained a Graph Neural Networks (GNN) model for financial anomaly detection with an accuracy of 99.94% and 0.9786 AUC Score.',
      'Utilized PyTorch Geometric Library for training models on two GCNConv layers using ReLU activation function.',
      'Engineered graph node embeddings and feature matrices to detect fraudulent transaction topologies with near-zero false alarms.',
    ],
    techStack: ['Python', 'PyTorch Geometric', 'scikit-learn', 'Graph Neural Networks', 'NumPy'],
  },
  {
    role: 'Chairperson & Advisory Member',
    company: 'Haryana Literary Association (HLA), VIT Chennai',
    shortName: 'HLA',
    type: 'leadership',
    location: 'Chennai, India',
    startDate: 'Feb 2025',
    current: true,
    status: 'published',
    order: 3,
    bullets: [
      'Led 10+ campus-wide cultural & literary initiatives, driving 2000+ total participant engagement and campus reach.',
      'Streamlined organizational event workflows, reducing planning time by 30% through effective task delegation and timeline scheduling.',
      'Mentored incoming executive board members on governance, event planning frameworks, and university compliance.',
    ],
    techStack: ['Strategic Leadership', 'Event Operations', 'Team Mentorship', 'Budget Planning'],
    positions: [
      {
        role: 'Chairperson',
        startDate: 'Feb 2025',
        endDate: 'Feb 2026',
        current: false,
        bullets: [
          'Led 10+ campus-wide cultural & literary initiatives, driving 2000+ total participant engagement and campus reach.',
          'Streamlined organizational event workflows, reducing planning time by 30% through effective task delegation and scheduling.',
          'Spearheaded an executive team of 25+ student coordinators across technical, logistics, and outreach domains.',
        ],
        techStack: ['Strategic Leadership', 'Event Operations', 'Budget Planning'],
      },
      {
        role: 'Advisory Member',
        startDate: 'Feb 2026',
        current: true,
        bullets: [
          'Mentoring the incoming executive board on governance, event planning frameworks, and university compliance.',
          'Advising on strategic growth initiatives, alumni outreach, and multi-club collaborative hackathons.',
        ],
        techStack: ['Team Mentorship', 'Strategic Advisory', 'Governance'],
      }
    ],
  },
  {
    role: 'Head of Web Development',
    company: 'Newton School Coding Club (NSCC), VIT Chennai',
    shortName: 'NSCC',
    type: 'club',
    location: 'Chennai, India',
    startDate: 'Apr 2025',
    current: true,
    status: 'published',
    order: 4,
    bullets: [
      'Led 5+ large-scale tech and cultural events, driving 1500+ attendee participation and increasing event reach by 40%.',
      'Spearheaded workshops and coding competitions boosting club membership by 35% year-over-year.',
      'Mentored 20+ junior developers, improving code quality and project delivery timelines by 25%.',
    ],
    techStack: ['React', 'Next.js', 'Node.js', 'Tailwind CSS', 'Web Architecture'],
    relatedProjects: [
      {
        id: '1',
        title: 'Skill-Bridge',
        category: 'fullstack',
        description: 'AI-based interview simulators & student-investor platform built with Next.js and Node.js.',
      }
    ],
  },
  {
    role: 'Full Stack & SEO Intern',
    company: 'HuslAI (Kriten Enterprises Private Limited)',
    shortName: 'KE',
    type: 'internship',
    location: 'Chennai, India',
    startDate: 'Aug 2025',
    endDate: 'Sep 2025',
    current: false,
    status: 'published',
    order: 5,
    bullets: [
      'Improved Search Engine Optimization (SEO) for Huslai, achieving a 3-4% increase in site visibility.',
      'Expanded B2B business outreach by connecting with potential enterprise clients.',
      'Enhanced website engagement metrics by 5-10%, driving higher user interaction and lower bounce rates.',
    ],
    techStack: ['SEO', 'Google Analytics', 'Next.js', 'B2B Growth'],
  },
  {
    role: 'Technical Team Member',
    company: 'IEEE RAS, VIT Chennai',
    shortName: 'IEEE',
    type: 'club',
    location: 'Chennai, India',
    startDate: 'Jun 2024',
    endDate: 'Jul 2025',
    current: false,
    status: 'published',
    order: 6,
    bullets: [
      'Managed 3+ national-level hackathons with 500+ combined participants, enhancing VIT\'s technical culture.',
      'Developed a MERN event platform with real-time updates, achieving 1000+ unique user visits and improving registration efficiency by 60%.',
      'Supported cross-functional teams to reduce technical issues by 40% during events.',
    ],
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io'],
    relatedProjects: [
      {
        id: '4',
        title: 'MERN Event Platform',
        category: 'fullstack',
        description: 'Real-time event management platform built for IEEE RAS with live registrations and updates.',
      }
    ],
  },
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const typeParam = searchParams.get('type');
    const featuredParam = searchParams.get('featured');

    const query: Record<string, any> = {};

    if (statusParam !== 'all') {
      query.status = { $ne: 'draft' };
    }
    if (typeParam && typeParam !== 'all') {
      query.type = typeParam;
    }
    if (featuredParam === 'true') {
      query.featured = true;
    }

    let experiences = await Experience.find(query).sort({ order: 1, startDate: -1 });

    // Auto-seed if database is completely empty
    if (!experiences || experiences.length === 0) {
      const count = await Experience.countDocuments();
      if (count === 0) {
        await Experience.insertMany(initialExperiences);
        experiences = await Experience.find(query).sort({ order: 1, startDate: -1 });
      }
    }

    return NextResponse.json(experiences);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    if (!body.company || !body.role) {
      return NextResponse.json({ error: 'Company and Role are required' }, { status: 400 });
    }

    // Auto-sync top level fields if positions array is supplied
    if (Array.isArray(body.positions) && body.positions.length > 0) {
      const activePos = body.positions.find((p: any) => p.current) || body.positions[0];
      if (!body.role) body.role = activePos.role;
      if (!body.startDate) body.startDate = activePos.startDate;
      if (body.current === undefined) body.current = activePos.current;
      if (!body.bullets || body.bullets.length === 0) body.bullets = activePos.bullets;
      if (!body.techStack || body.techStack.length === 0) body.techStack = activePos.techStack;
    }

    const experience = await Experience.create(body);
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}

