/**
 * Seed script — run with:
 *   npx ts-node -r tsconfig-paths/register scripts/seed.ts
 *
 * Make sure MONGODB_URI is set in .env.local first.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
console.log("MONGO URI:", process.env.MONGODB_URI);
// ── Models (inline to avoid import issues in ts-node) ──────────────────────

const ProjectSchema = new mongoose.Schema({
  title: String, description: String, techStack: [String],
  liveUrl: String, githubUrl: String, highlights: [String],
  order: Number, featured: Boolean, imageUrl: String,
}, { timestamps: true });

const ExperienceSchema = new mongoose.Schema({
  role: String, company: String, shortName: String, websiteUrl: String, logoUrl: String,
  type: String, location: String, startDate: String, endDate: String,
  current: Boolean, bullets: [String], techStack: [String], featured: Boolean,
  positions: [{ role: String, startDate: String, endDate: String, current: Boolean, bullets: [String], techStack: [String], metrics: [{ value: String, label: String, description: String }] }],
  relatedProjects: [{ id: String, title: String, category: String, description: String }],
  displaySettings: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, default: 'published' },
  order: Number,
}, { timestamps: true });

const SkillSchema = new mongoose.Schema({
  name: String,
  category: { type: String, enum: ['technical','frontend','backend','ml','data'] },
  proficiency: Number, icon: String, order: Number,
});

const AchievementSchema = new mongoose.Schema({
  title: String, event: String, year: Number, description: String,
  rank: String, international: Boolean, order: Number,
}, { timestamps: true });

const Project     = mongoose.models.Project     || mongoose.model('Project',     ProjectSchema);
const Experience  = mongoose.models.Experience  || mongoose.model('Experience',  ExperienceSchema);
const Skill       = mongoose.models.Skill       || mongoose.model('Skill',       SkillSchema);
const Achievement = mongoose.models.Achievement || mongoose.model('Achievement', AchievementSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌  MONGODB_URI not set in .env.local'); process.exit(1); }

  console.log('🔌  Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅  Connected.\n');

  // Clear existing
  await Promise.all([Project.deleteMany({}), Experience.deleteMany({}), Skill.deleteMany({}), Achievement.deleteMany({})]);
  console.log('🗑   Cleared existing data.\n');

  // ── Projects ──────────────────────────────────────────────────────────────
  await Project.insertMany([
    {
      title: 'Skill-Bridge', featured: true, order: 1,
      description: 'A funding platform connecting student-investor pairs with AI-based interview simulators and skill assessments.',
      techStack: ['Next.js', 'Node.js', 'MongoDB', 'Express.js', 'AI/ML'],
      highlights: [
        'Launched platform connecting 50+ simulated student-investor pairs during testing',
        'Integrated AI-based interview simulators raising candidate credibility scores by 20%',
        'Reduced onboarding time by 50% with intuitive UX using Next.js and Node.js',
      ],
      githubUrl: '', liveUrl: '',
    },
    {
      title: 'CloudSave', featured: false, order: 2,
      description: 'Secure expense tracking platform engineered with Microsoft Azure and custom authentication flows.',
      techStack: ['Microsoft Azure', 'React.js', 'Node.js'],
      highlights: [
        'Reduced server response times by 40% using Microsoft Azure',
        'Designed custom authentication flows improving data privacy compliance',
        'Eliminated 100% of unauthorized access attempts in testing',
      ],
      githubUrl: '', liveUrl: '',
    },
    {
      title: 'Digital-Ardhti', featured: false, order: 3,
      description: 'AI-enabled marketplace for direct farmer-to-buyer sales using blockchain smart contracts and price prediction models.',
      techStack: ['Blockchain', 'Smart Contracts', 'AI/ML', 'React.js'],
      highlights: [
        'Cut intermediary costs by 25-30% for farmers',
        'Integrated price prediction models and blockchain for 100+ automated transactions with zero security breaches',
        'Increased projected farmer earnings by up to 30%',
      ],
      githubUrl: '', liveUrl: '',
    },
    {
      title: 'MERN Event Platform (IEEE RAS)', featured: false, order: 4,
      description: 'Real-time event management platform with live registrations, updates, and hackathon coordination for IEEE RAS VIT Chennai.',
      techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      highlights: [
        'Achieved 1000+ unique user visits with real-time updates',
        'Improved registration efficiency by 60%',
        'Supported 3+ national hackathons with 500+ combined participants',
      ],
      githubUrl: '', liveUrl: '',
    },
  ]);
  console.log('✅  Projects seeded (4 projects)');

  // ── Experience ────────────────────────────────────────────────────────────
  await Experience.insertMany([
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
  ]);
  console.log('✅  Experiences seeded (6 entries)');

  // ── Skills ────────────────────────────────────────────────────────────────
  await Skill.insertMany([
    // Technical
    { name: 'Java',          category: 'technical', proficiency: 85, order: 1 },
    { name: 'Python',        category: 'technical', proficiency: 92, order: 2 },
    { name: 'C/C++',         category: 'technical', proficiency: 80, order: 3 },
    { name: 'SQL',           category: 'technical', proficiency: 82, order: 4 },
    { name: 'AWS',           category: 'technical', proficiency: 75, order: 5 },
    { name: 'Microsoft Azure', category: 'technical', proficiency: 78, order: 6 },
    { name: 'GCP',           category: 'technical', proficiency: 70, order: 7 },
    // Frontend
    { name: 'React.js',      category: 'frontend',  proficiency: 92, order: 1 },
    { name: 'Next.js',       category: 'frontend',  proficiency: 90, order: 2 },
    { name: 'TypeScript',    category: 'frontend',  proficiency: 85, order: 3 },
    { name: 'Tailwind CSS',  category: 'frontend',  proficiency: 93, order: 4 },
    { name: 'HTML/CSS',      category: 'frontend',  proficiency: 95, order: 5 },
    { name: 'JavaScript',    category: 'frontend',  proficiency: 90, order: 6 },
    // Backend
    { name: 'Node.js',       category: 'backend',   proficiency: 88, order: 1 },
    { name: 'Express.js',    category: 'backend',   proficiency: 85, order: 2 },
    { name: 'MongoDB',       category: 'backend',   proficiency: 85, order: 3 },
    { name: 'Redis',         category: 'backend',   proficiency: 70, order: 4 },
    // ML
    { name: 'PyTorch Geometric', category: 'ml',    proficiency: 85, order: 1 },
    { name: 'scikit-learn',  category: 'ml',        proficiency: 88, order: 2 },
    { name: 'NumPy / Pandas',category: 'ml',        proficiency: 90, order: 3 },
    { name: 'Graph Neural Networks', category: 'ml', proficiency: 82, order: 4 },
    // Data
    { name: 'MATLAB',        category: 'data',      proficiency: 75, order: 1 },
    { name: 'R Studio',      category: 'data',      proficiency: 72, order: 2 },
    { name: 'Matplotlib',    category: 'data',      proficiency: 80, order: 3 },
  ]);
  console.log('✅  Skills seeded (24 skills)');

  // ── Achievements ──────────────────────────────────────────────────────────
  await Achievement.insertMany([
    {
      title: "3rd Place — Spectrum'25 Hackathon",
      event: "Spectrum'25", year: 2025, rank: '3rd Place', international: false, order: 1,
      description: "Delivered a production-ready web app under 24 hours, demonstrating rapid prototyping and problem-solving skills.",
    },
    {
      title: "IEEE Yesist'12 International Hackathon Finalist 2025",
      event: "IEEE Yesist'12", year: 2025, rank: 'Top 20 Global', international: true, order: 2,
      description: "Top 20 global teams — presented project in Malaysia. Back-to-back international finalist representing VIT Chennai.",
    },
    {
      title: "IEEE Yesist'12 International Hackathon Finalist 2024",
      event: "IEEE Yesist'12", year: 2024, rank: 'Top 20 Global', international: true, order: 3,
      description: "Top 20 global teams — presented project in Tunisia. First international hackathon appearance.",
    },
    {
      title: "Devshouse'25 National Hackathon Finalist",
      event: "Devshouse'25", year: 2025, rank: 'Top 60 / 5000+', international: false, order: 4,
      description: "Top 60 of 5000+ participants nationwide, recognized for innovation and technical excellence.",
    },
  ]);
  console.log('✅  Achievements seeded (4 achievements)\n');

  console.log('🎉  Database seeded successfully!');
  console.log('    You can now start your Next.js app with: npm run dev');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
