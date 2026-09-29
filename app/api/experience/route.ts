import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Experience from '@/lib/models/Experience';

export const dynamic = 'force-dynamic';

const initialExperiences = [
  {
    role: 'Full Stack Development Intern',
    company: 'Religare Broking Limited',
    shortName: 'RBL',
    websiteUrl: 'https://www.religareonline.com',
    type: 'internship',
    location: 'Noida, India (Hybrid)',
    startDate: 'May 2026',
    endDate: 'Jun 2026',
    current: true,
    featured: true,
    status: 'published',
    order: 0,
    bullets: [
      'Automated end-to-end user journeys using Maestro, integrating test runs with Jenkins pipelines to accelerate release feedback cycles.',
      'Authored modular flow definitions and resilient edge-case handlers for critical production flows (e.g. KYC, funds withdrawal).',
      'Engineered cross-platform mobile & web client architecture handling high-concurrency real-time market data streams.'
    ],
    techStack: ['Flutter', 'Maestro', 'Jenkins', 'Dart', 'CI/CD', 'REST APIs'],
    positions: [
      {
        role: 'Full Stack Development Intern',
        startDate: 'May 2026',
        endDate: 'Jun 2026',
        current: true,
        bullets: [
          'Automated end-to-end user journeys using Maestro, integrating test runs with Jenkins pipelines to accelerate release feedback cycles.',
          'Authored modular flow definitions and resilient edge-case handlers for critical production flows.'
        ],
        techStack: ['Flutter', 'Maestro', 'Jenkins', 'Dart', 'CI/CD'],
        metrics: [
          { value: '45%', label: 'Test Coverage Boost', description: 'Across critical KYC & checkout flows' },
          { value: '3x', label: 'Faster Pipeline Feedback', description: 'Automated release verification' }
        ]
      }
    ],
    relatedProjects: [
      { id: 'religare-qa', title: 'Maestro E2E Test Suite', category: 'DevOps & QA', description: 'Automated test suite integrated with Jenkins CI' }
    ],
    displaySettings: {
      displaySide: 'left',
      showMetrics: true,
      showRoleProgression: true,
      accentColor: '#00d4ff'
    }
  },
  {
    role: 'Machine Learning Research Intern',
    company: 'VIT Research Lab',
    shortName: 'VIT-R',
    websiteUrl: 'https://chennai.vit.ac.in',
    type: 'research',
    location: 'Chennai, India',
    startDate: 'Dec 2025',
    endDate: 'Mar 2026',
    current: false,
    featured: true,
    status: 'published',
    order: 1,
    bullets: [
      'Investigated deep learning architectures for multimodal biometric signal analysis and synthetic dataset generation.',
      'Optimized transformer self-attention mechanisms with FlashAttention-2, achieving 2.8x faster inference speeds on NVIDIA RTX GPUs.',
      'Drafted manuscript for peer-reviewed IEEE conference submission on low-latency edge AI models.'
    ],
    techStack: ['PyTorch', 'Hugging Face', 'CUDA', 'Python', 'Weights & Biases', 'ONNX'],
    positions: [
      {
        role: 'Machine Learning Research Intern',
        startDate: 'Dec 2025',
        endDate: 'Mar 2026',
        current: false,
        bullets: [
          'Investigated deep learning architectures for multimodal biometric signal analysis and synthetic dataset generation.',
          'Optimized transformer self-attention mechanisms with FlashAttention-2, achieving 2.8x faster inference speeds.'
        ],
        techStack: ['PyTorch', 'CUDA', 'Python', 'ONNX'],
        metrics: [
          { value: '2.8x', label: 'Inference Speedup', description: 'FlashAttention-2 custom kernel optimization' },
          { value: '1', label: 'IEEE Manuscript', description: 'Under review for peer publication' }
        ]
      }
    ],
    relatedProjects: [
      { id: 'neuro-edge', title: 'Edge Attention Kernel', category: 'Deep Learning', description: 'Low-latency attention layer for edge devices' }
    ],
    displaySettings: {
      displaySide: 'right',
      showMetrics: true,
      accentColor: '#f59e0b'
    }
  },
  {
    role: 'Chairperson / Advisory Board Member',
    company: 'Haryana Literary Association',
    shortName: 'HLA',
    websiteUrl: 'https://hla-vitc.org',
    type: 'leadership',
    location: 'Chennai, India',
    startDate: 'Jul 2025',
    endDate: 'Present',
    current: true,
    featured: true,
    status: 'published',
    order: 2,
    bullets: [
      'Spearheaded 120+ student executive body, overseeing budgeting, creative direction, and technical operations for regional cultural conclaves.',
      'Scaled annual flagship event participation to 3,500+ attendees across 18 universities with zero logistical incidents.',
      'Transitioned into Advisory Board Member to mentor incoming executive committee on strategic partnerships and fundraising.'
    ],
    techStack: ['Team Leadership', 'Operations', 'Event Architecture', 'Public Speaking', 'Budgeting'],
    positions: [
      {
        role: 'Advisory Board Member',
        startDate: 'Jan 2026',
        endDate: 'Present',
        current: true,
        bullets: [
          'Mentoring incoming executive board on institutional partnerships, alumni outreach, and sponsorships.',
          'Advising on long-term technological infrastructure for student event registrations.'
        ],
        techStack: ['Strategic Advisory', 'Mentorship', 'Partnerships'],
        metrics: [
          { value: '120+', label: 'Team Mentored', description: 'Executive board & committee members' }
        ]
      },
      {
        role: 'Chairperson',
        startDate: 'Jul 2025',
        endDate: 'Dec 2025',
        current: false,
        bullets: [
          'Directed operations for regional literary and cultural festivals with 3,500+ attendees.',
          'Managed financial budgets exceeding ₹4.5L with transparent milestone accounting.'
        ],
        techStack: ['Executive Leadership', 'Budget Management', 'Event Architecture'],
        metrics: [
          { value: '3.5k+', label: 'Event Attendees', description: 'Across 18 regional universities' },
          { value: '₹4.5L+', label: 'Budget Managed', description: 'Delivered with 100% audit compliance' }
        ]
      }
    ],
    displaySettings: {
      displaySide: 'left',
      showRoleProgression: true,
      progressionLabel: 'Leadership Journey',
      accentColor: '#ec4899'
    }
  },
  {
    role: 'Head of Web Development',
    company: 'Newton School Coding Club',
    shortName: 'NSCC',
    websiteUrl: 'https://nscc-vitc.tech',
    type: 'club',
    location: 'Chennai, India',
    startDate: 'Apr 2025',
    endDate: 'Feb 2026',
    current: false,
    featured: false,
    status: 'published',
    order: 3,
    bullets: [
      'Architected club portal and real-time coding contest platform serving 2,000+ active student developers.',
      'Conducted 6+ technical bootcamps on Next.js, WebSockets, and distributed systems architecture.'
    ],
    techStack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Redis'],
    positions: [
      {
        role: 'Head of Web Development',
        startDate: 'Apr 2025',
        endDate: 'Feb 2026',
        current: false,
        bullets: [
          'Architected club portal and real-time coding contest platform serving 2,000+ active student developers.',
          'Conducted 6+ technical bootcamps on Next.js, WebSockets, and distributed systems architecture.'
        ],
        techStack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'],
        metrics: [
          { value: '2k+', label: 'Active Users', description: 'Platform developer community' },
          { value: '6+', label: 'Workshops Led', description: 'Full-stack engineering sessions' }
        ]
      }
    ],
    displaySettings: {
      displaySide: 'right',
      accentColor: '#a855f7'
    }
  },
  {
    role: 'Full Stack & SEO Intern',
    company: 'HuslAI (Kriten Enterprises)',
    shortName: 'HuslAI',
    type: 'internship',
    location: 'Chennai, India',
    startDate: 'Aug 2025',
    endDate: 'Sep 2025',
    current: false,
    status: 'published',
    order: 4,
    bullets: [
      'Improved Search Engine Optimization (SEO) for Huslai, achieving a 3-4% increase in site visibility.',
      'Expanded B2B business outreach by connecting with potential enterprise clients.',
      'Enhanced website engagement metrics by 5-10%, driving higher user interaction and lower bounce rates.'
    ],
    techStack: ['SEO', 'Google Analytics', 'Next.js', 'B2B Growth'],
    displaySettings: {
      displaySide: 'left',
      accentColor: '#00d4ff'
    }
  },
  {
    role: 'Technical Team Member',
    company: 'IEEE RAS, VIT Chennai',
    shortName: 'IEEE RAS',
    type: 'club',
    location: 'Chennai, India',
    startDate: 'Jun 2024',
    endDate: 'Jul 2025',
    current: false,
    status: 'published',
    order: 5,
    bullets: [
      'Managed 3+ national-level hackathons with 500+ combined participants, enhancing technical culture.',
      'Developed a MERN event platform with real-time updates, achieving 1000+ unique user visits and improving registration efficiency by 60%.',
      'Supported cross-functional teams to reduce technical issues by 40% during events.'
    ],
    techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io'],
    displaySettings: {
      displaySide: 'right',
      accentColor: '#a855f7'
    }
  }
];

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const typeParam = searchParams.get('type');
    const featuredParam = searchParams.get('featured');
    const searchParam = searchParams.get('search');

    const query: Record<string, any> = {};

    // By default, include all published experiences or experiences without explicit draft/archived status
    if (statusParam === 'draft') {
      query.status = 'draft';
    } else if (statusParam === 'archived') {
      query.status = 'archived';
    } else if (statusParam !== 'all') {
      query.status = { $nin: ['draft', 'archived'] };
    }

    if (typeParam && typeof typeParam === 'string' && typeParam !== 'all') {
      query.type = { $regex: new RegExp(`^${typeParam.trim()}$`, 'i') };
    }

    if (featuredParam === 'true') {
      query.featured = true;
    }

    if (searchParam && typeof searchParam === 'string' && searchParam.trim()) {
      const sanitized = searchParam.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.$or = [
        { company: { $regex: sanitized, $options: 'i' } },
        { role: { $regex: sanitized, $options: 'i' } },
        { techStack: { $regex: sanitized, $options: 'i' } },
      ];
    }

    let experiences = await Experience.find(query).sort({ order: 1, createdAt: -1 });

    // Auto-seed or backfill if database collection is empty
    if (!experiences || experiences.length === 0) {
      const totalInDb = await Experience.countDocuments();
      if (totalInDb === 0) {
        await Experience.insertMany(initialExperiences);
        experiences = await Experience.find(query).sort({ order: 1, createdAt: -1 });
      }
    }

    return NextResponse.json(experiences);
  } catch (err) {
    console.error('API /api/experience GET error:', err);
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
      if (activePos) {
        if (!body.role) body.role = activePos.role;
        if (!body.startDate) body.startDate = activePos.startDate;
        if (body.current === undefined) body.current = activePos.current;
        if (!body.bullets || body.bullets.length === 0) body.bullets = activePos.bullets;
        if (!body.techStack || body.techStack.length === 0) body.techStack = activePos.techStack;
      }
    }

    const experience = await Experience.create(body);
    return NextResponse.json(experience, { status: 201 });
  } catch (err) {
    console.error('API /api/experience POST error:', err);
    return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 });
  }
}
