import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISections {
  education: boolean;
  skills: boolean;
  codingStats?: boolean;
  experience: boolean;
  projects: boolean;
  achievements: boolean;
  certifications: boolean;
  // per-platform toggles (inside sections for clean grouping)
  showLeetcode?: boolean;
  showCodeforces?: boolean;
  showGithub?: boolean;
  showGfg?: boolean;
  showCodechef?: boolean;
}

export interface IProfile extends Document {
  name: string;
  surname: string;
  statusBadge: string;
  openToWork: boolean;
  roles: string[];
  tagline: string;
  githubUrl: string;
  githubUsername: string;
  leetcodeUsername: string;
  codeforcesUsername?: string;
  codechefUsername?: string;
  gfgUsername?: string;
  linkedinUrl: string;
  email: string;
  phone: string;
  contactBio: string;
  footerText: string;
  resumeUrl: string;
  avatarUrl: string;
  showCodingStats: boolean;
  showLeetcodeStats: boolean;
  showGithubStats: boolean;
  showAtsResume: boolean;
  projectCategories: string[];
  sections: ISections;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    name:             { type: String, default: 'PULKIT' },
    surname:          { type: String, default: 'SINGHROHA' },
    statusBadge:      { type: String, default: 'Open to Opportunities' },
    openToWork:       { type: Boolean, default: true },
    roles:            { type: [String], default: [
      'Full Stack Developer',
      'ML Engineer',
      'Graph Neural Networks Researcher',
      'Web Dev Lead @ NSCC VIT',
      'Hackathon Finalist',
    ]},
    tagline:          { type: String, default: 'B.Tech CSE @ VIT Chennai · CGPA 9.02 · Building the future one commit at a time.' },
    githubUrl:        { type: String, default: 'https://github.com/pulkit31s' },
    githubUsername:   { type: String, default: 'pulkit31s' },
    leetcodeUsername: { type: String, default: 'pulkit31s' },
    codeforcesUsername: { type: String, default: 'pulkit31s' },
    codechefUsername: { type: String, default: 'pulkit31s' },
    gfgUsername:      { type: String, default: 'pulkit31s' },
    linkedinUrl:      { type: String, default: 'https://linkedin.com' },
    email:            { type: String, default: 'hello@example.com' },
    phone:            { type: String, default: '+1 (000) 000-0000' },
    contactBio:       { type: String, default: 'Currently open to internships, research collaborations, and full-stack opportunities. Let\'s connect!' },
    footerText:       { type: String, default: 'PULKIT · VIT CHENNAI · B.TECH CSE 2027' },
    resumeUrl:        { type: String, default: '' },
    avatarUrl:        { type: String, default: 'https://github.com/pulkit31s.png' },
    showCodingStats:  { type: Boolean, default: true },
    showLeetcodeStats: { type: Boolean, default: true },
    showGithubStats:   { type: Boolean, default: true },
    showAtsResume:     { type: Boolean, default: true },
    projectCategories: { type: [String], default: ['Full Stack & MERN', 'AI / ML', 'Cloud & DevOps', 'Web Development', 'Blockchain'] },
    sections: {
      type: {
        education:       { type: Boolean, default: true },
        skills:          { type: Boolean, default: true },
        codingStats:     { type: Boolean, default: true },
        experience:      { type: Boolean, default: true },
        projects:        { type: Boolean, default: true },
        achievements:    { type: Boolean, default: true },
        certifications:  { type: Boolean, default: false },
        showLeetcode:    { type: Boolean, default: true },
        showCodeforces:  { type: Boolean, default: true },
        showGithub:      { type: Boolean, default: true },
        showGfg:         { type: Boolean, default: true },
        showCodechef:    { type: Boolean, default: true },
      },
      default: {
        education: true,
        skills: true,
        codingStats: true,
        experience: true,
        projects: true,
        achievements: true,
        certifications: false,
        showLeetcode: true,
        showCodeforces: true,
        showGithub: true,
        showGfg: true,
        showCodechef: false,
      },
    },
  },
  { timestamps: true }
);

// Singleton — always upsert the first (and only) document
const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;
