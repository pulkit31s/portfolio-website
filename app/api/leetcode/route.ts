import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || 'pulkit31s';

  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `LeetCode API status ${res.status}` }, { status: 500 });
    }

    const json = await res.json();
    const matchedUser = json?.data?.matchedUser;

    if (!matchedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const ranking = matchedUser.profile?.ranking || 0;
    const acNum = matchedUser.submitStatsGlobal?.acSubmissionNum || [];

    const allObj    = acNum.find((x: { difficulty: string }) => x.difficulty === 'All');
    const easyObj   = acNum.find((x: { difficulty: string }) => x.difficulty === 'Easy');
    const mediumObj = acNum.find((x: { difficulty: string }) => x.difficulty === 'Medium');
    const hardObj   = acNum.find((x: { difficulty: string }) => x.difficulty === 'Hard');

    return NextResponse.json({
      status: 'success',
      totalSolved: allObj?.count || 0,
      easySolved: easyObj?.count || 0,
      mediumSolved: mediumObj?.count || 0,
      hardSolved: hardObj?.count || 0,
      ranking,
    });
  } catch (error) {
    console.error('LeetCode API error:', error);
    return NextResponse.json({ error: 'Failed to fetch LeetCode stats' }, { status: 500 });
  }
}
