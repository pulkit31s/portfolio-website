import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Education from '@/lib/models/Education';

export async function GET() {
  try {
    await dbConnect();
    let education = await Education.find().sort({ order: 1, startYear: -1 });
    if (education.length === 0) {
      const defaultEdu = await Education.create({
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        institution: 'Vellore Institute of Technology',
        location: 'Chennai, India',
        startYear: 2023,
        current: true,
        cgpa: 9.02,
        coursework: [
          'Data Structures & Algorithms',
          'Operating Systems',
          'DBMS',
          'Computer Networks',
          'Machine Learning',
          'Software Engineering'
        ],
        order: 1
      });
      education = [defaultEdu];
    }
    return NextResponse.json(education);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const education = await Education.create(body);
    return NextResponse.json(education, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}
