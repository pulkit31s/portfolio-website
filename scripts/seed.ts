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
  role: String, company: String,
  type: { type: String, enum: ['internship','part-time','club','research','leadership'] },
  location: String, startDate: String, endDate: String,
  current: Boolean, bullets: [String], techStack: [String], order: Number,
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
      role: 'Head of Web Development', company: 'Newton School Coding Club (NSCC), VIT Chennai',
      type: 'club', location: 'Chennai, India', startDate: 'Apr 2025', current: true, order: 1,
      bullets: [
        'Led 5+ large-scale tech and cultural events, driving 1500+ attendee participation and increasing event reach by 40%.',
        'Spearheaded workshops and coding competitions boosting club membership by 35% year-over-year.',
        'Mentored 20+ junior developers, improving code quality and project delivery timelines by 25%.',
      ],
      techStack: ['React', 'Next.js', 'Node.js', 'Tailwind'],
    },
    {
      role: 'Summer Research Industrial Intern', company: 'Vellore Institute of Technology, Chennai',
      type: 'research', location: 'Chennai, India', startDate: 'May 2025', endDate: 'Jul 2025', current: false, order: 2,
      bullets: [
        'Trained a Graph Neural Networks Model with an accuracy of 99.94% and 0.9786 AUC Score.',
        'Utilized PyTorch Geometric Library for training models on two GCNConv layers using ReLU activation function.',
      ],
      techStack: ['Python', 'PyTorch Geometric', 'scikit-learn', 'NumPy'],
    },
    {
      role: 'Chair-Person', company: 'Haryana Hood Club, VIT Chennai',
      type: 'leadership', location: 'Chennai, India', startDate: 'Nov 2025', current: true, order: 3,
      bullets: [
        'Coordinated 10+ campus-wide cultural events, strengthening community engagement by 50%.',
        'Streamlined event operations, reducing planning time by 30% through effective task delegation and scheduling.',
      ],
      techStack: [],
    },
    {
      role: 'Intern (SEO & B2B Outreach)', company: 'Kriten Enterprises Private Limited',
      type: 'internship', location: 'Chennai, India', startDate: 'Aug 2025', endDate: 'Sep 2025', current: false, order: 4,
      bullets: [
        'Improved Search Engine Optimization (SEO) for Huslai, achieving a 3-4% increase in site visibility.',
        'Expanded B2B business outreach by connecting with potential business clients.',
        'Enhanced website engagement metrics by 5-10%, driving higher user interaction.',
      ],
      techStack: ['SEO', 'Google Analytics', 'B2B'],
    },
    {
      role: 'Technical Team Member', company: 'IEEE RAS, VIT Chennai',
      type: 'club', location: 'Chennai, India', startDate: 'Jun 2024', endDate: 'Jul 2025', current: false, order: 5,
      bullets: [
        'Managed 3+ national-level hackathons with 500+ combined participants, enhancing VIT\'s technical culture.',
        'Developed a MERN event platform with real-time updates, achieving 1000+ unique user visits and improving registration efficiency by 60%.',
        'Supported cross-functional teams to reduce technical issues by 40% during events.',
      ],
      techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    },
  ]);
  console.log('✅  Experiences seeded (5 entries)');

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
