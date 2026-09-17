import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import ExperienceCategory from '@/lib/models/ExperienceCategory';

export const dynamic = 'force-dynamic';

const defaultCategories = [
  { name: 'Internship',  slug: 'internship',  description: 'Industrial and company internships',   color: '#00d4ff', bg: 'rgba(0,212,255,0.1)',  order: 1, isActive: true, showInFilters: true },
  { name: 'Research',    slug: 'research',    description: 'Academic & laboratory ML research',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', order: 2, isActive: true, showInFilters: true },
  { name: 'Leadership',  slug: 'leadership',  description: 'Organizational & team leadership',      color: '#ec4899', bg: 'rgba(236,72,153,0.1)', order: 3, isActive: true, showInFilters: true },
  { name: 'Club / Org',  slug: 'club',        description: 'Technical chapters and college clubs', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', order: 4, isActive: true, showInFilters: true },
  { name: 'Part-Time',   slug: 'part-time',   description: 'Part-time roles and freelance work',    color: '#10b981', bg: 'rgba(16,185,129,0.1)', order: 5, isActive: true, showInFilters: true },
];

export async function GET() {
  try {
    await dbConnect();
    let categories = await ExperienceCategory.find().sort({ order: 1 });
    
    // Auto-seed default categories if database collection is empty
    if (!categories || categories.length === 0) {
      await ExperienceCategory.insertMany(defaultCategories);
      categories = await ExperienceCategory.find().sort({ order: 1 });
    }

    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const existing = await ExperienceCategory.findOne({ slug: body.slug.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 400 });
    }

    const category = await ExperienceCategory.create({
      ...body,
      slug: body.slug.toLowerCase().trim(),
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
