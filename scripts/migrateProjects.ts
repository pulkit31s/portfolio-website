import { dbConnect } from '../lib/dbConnect';
import Project from '../lib/models/Project';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

function slugify(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function migrate() {
  await dbConnect();
  console.log('Connected to MongoDB');

  const projects = await Project.find();
  console.log(`Found ${projects.length} projects`);

  for (const project of projects) {
    let changed = false;
    
    if (!project.slug) {
      project.slug = slugify(project.title) || `project-${project._id.toString().substring(0, 6)}`;
      changed = true;
    }
    
    // In original schema, description was the short description on the card
    if (project.description && !project.shortDescription) {
      project.shortDescription = project.description;
      changed = true;
    }

    if (!project.status) {
      project.status = 'Live'; // Or 'In Development' depending on liveUrl
      if (!project.liveUrl) {
          project.status = 'Archived';
      }
      changed = true;
    }

    if (changed) {
      await project.save();
      console.log(`Updated project: ${project.title}`);
    }
  }

  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(console.error);
