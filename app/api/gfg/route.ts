import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function extract(html: string, key: string): number | string | null {
  const re = new RegExp(`\\\\"${key}\\\\":(\\d+|"[^"]*"|\\\\"[^"]*\\\\")`);
  const m = html.match(re);
  if (!m) return null;
  const val = m[1];
  if (/^\d+$/.test(val)) return parseInt(val);
  return val.replace(/\\"/g, '').replace(/"/g, '');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username required' }, { status: 400 });
  }

  try {
    const url = `https://www.geeksforgeeks.org/user/${encodeURIComponent(username)}/`;

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`GFG returned ${res.status}`);

    const html = await res.text();

    // GFG embeds stats as escaped JSON in a script tag — parse it directly
    const codingScore     = extract(html, 'score') as number | null;
    const monthlyScore    = extract(html, 'monthly_score') as number | null;
    const totalSolved     = extract(html, 'total_problems_solved') as number | null;
    const instituteRank   = extract(html, 'institute_rank');
    const longestStreak   = extract(html, 'pod_solved_longest_streak') as number | null;
    const currentStreak   = extract(html, 'pod_solved_current_streak') as number | null;
    const globalStreak    = extract(html, 'pod_solved_global_longest_streak') as number | null;

    // Sanity-check: if score is null the page didn't have user data
    if (codingScore === null && totalSolved === null) {
      throw new Error('User not found or no data in page');
    }

    return NextResponse.json({
      username,
      codingScore,
      monthlyScore,
      totalSolved,
      instituteRank: instituteRank || '—',
      longestStreak,
      currentStreak,
      globalStreak,
    });
  } catch (err) {
    console.error('GFG scrape error:', err);
    return NextResponse.json(
      { error: 'Could not fetch GFG data', username },
      { status: 404 }
    );
  }
}
