import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || 'pulkit31s';

  try {
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'PortfolioApp/1.0',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({
        username,
        rating: 1420,
        maxRating: 1510,
        rank: 'Specialist',
        maxRank: 'Specialist',
        friendOfCount: 42,
      });
    }

    const data = await res.json();
    if (data.status === 'OK' && data.result && data.result.length > 0) {
      const user = data.result[0];
      return NextResponse.json({
        username: user.handle,
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        rank: user.rank || 'Unrated',
        maxRank: user.maxRank || 'Unrated',
        friendOfCount: user.friendOfCount || 0,
        contribution: user.contribution || 0,
        avatar: user.titlePhoto || user.avatar,
      });
    }

    return NextResponse.json({
      username,
      rating: 1420,
      maxRating: 1510,
      rank: 'Specialist',
      maxRank: 'Specialist',
    });
  } catch {
    return NextResponse.json({
      username,
      rating: 1420,
      maxRating: 1510,
      rank: 'Specialist',
      maxRank: 'Specialist',
    });
  }
}
