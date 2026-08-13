import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || 'pulkit31s';

    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'pulkit-portfolio',
        ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({
        username,
        publicRepos: 18,
        followers: 12,
        following: 15,
        avatarUrl: `https://github.com/${username}.png`,
      });
    }

    const data = await res.json();

    return NextResponse.json({
      username: data.login,
      name: data.name,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      location: data.location,
    });
  } catch (error) {
    console.error('GitHub API fetch error:', error);
    return NextResponse.json({
      username: 'pulkit31s',
      publicRepos: 18,
      followers: 12,
      following: 15,
      avatarUrl: 'https://github.com/pulkit31s.png',
    });
  }
}
