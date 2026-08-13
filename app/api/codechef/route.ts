import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  try {
    // CodeChef public API
    const res = await fetch(
      `https://www.codechef.com/users/${encodeURIComponent(username)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error(`CodeChef returned ${res.status}`);

    const html = await res.text();

    // Extract rating from profile page
    const ratingMatch = html.match(/"currentRating"\s*:\s*(\d+)/);
    const maxRatingMatch = html.match(/"highestRating"\s*:\s*(\d+)/);
    const starsMatch = html.match(/"stars"\s*:\s*"([^"]+)"/);
    const globalRankMatch = html.match(/"globalRank"\s*:\s*(\d+)/);
    const countryRankMatch = html.match(/"countryRank"\s*:\s*(\d+)/);
    const fullyAcceptedMatch = html.match(/"totalProblemsSolved"\s*:\s*(\d+)/);

    const rating = ratingMatch ? parseInt(ratingMatch[1]) : null;
    const maxRating = maxRatingMatch ? parseInt(maxRatingMatch[1]) : null;
    const stars = starsMatch ? starsMatch[1] : null;
    const globalRank = globalRankMatch ? parseInt(globalRankMatch[1]) : null;
    const countryRank = countryRankMatch ? parseInt(countryRankMatch[1]) : null;
    const totalSolved = fullyAcceptedMatch ? parseInt(fullyAcceptedMatch[1]) : null;

    if (!rating && !stars) throw new Error('Could not parse CodeChef data');

    return NextResponse.json({
      username,
      rating,
      maxRating,
      stars,
      globalRank,
      countryRank,
      totalSolved,
    });
  } catch (err) {
    console.error('CodeChef fetch error:', err);
    return NextResponse.json(
      { error: 'Could not fetch CodeChef data', username },
      { status: 404 }
    );
  }
}
