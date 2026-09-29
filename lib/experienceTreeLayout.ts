import type { Experience } from '@/components/sections/Experience';

export interface PositionLayoutNode {
  role: string;
  posIdx: number;
  startDate: string;
  endDate?: string;
  current: boolean;
  position: [number, number, number];
  metrics?: { value: string; label: string; description?: string }[];
}

export interface TreeLayoutNode {
  id: string;
  experience: Experience;
  index: number;
  side: 'left' | 'right';
  trunkPoint: [number, number, number];
  nodePoint: [number, number, number];
  curvePoints: [number, number, number][];
  color: string;
  category: string;
  shortName: string;
  isCurrent: boolean;
  isFeatured: boolean;
  positionsCount: number;
  positionsLayout: PositionLayoutNode[];
}

export interface TreeLayoutResult {
  nodes: TreeLayoutNode[];
  trunkStart: [number, number, number];
  trunkEnd: [number, number, number];
  presentDayPoint: [number, number, number];
  totalHeight: number;
}

/**
 * Pure layout algorithm for calculating 3D coordinates for the Experience Tree.
 * Isolates all spatial and mathematical transformations from rendering components.
 */
export function calculateExperienceTreeLayout(
  experiences: Experience[],
  typeConfigMap: Record<string, { color: string; label: string; bg: string }> = {}
): TreeLayoutResult {
  if (!experiences || experiences.length === 0) {
    return {
      nodes: [],
      trunkStart: [0, -3, 0],
      trunkEnd: [0, 3, 0],
      presentDayPoint: [0, 4, 0],
      totalHeight: 6,
    };
  }

  const count = experiences.length;
  // Dynamic spacing between nodes based on total items
  const nodeSpacing = 3.2;
  const topY = ((count - 1) / 2) * nodeSpacing;
  const bottomY = -((count - 1) / 2) * nodeSpacing;

  const nodes: TreeLayoutNode[] = experiences.map((exp, idx) => {
    // Determine category styling
    const catKey = (exp.type || 'internship').toLowerCase();
    const catConfig = typeConfigMap[catKey] || {
      color: exp.displaySettings?.accentColor || '#00d4ff',
      label: exp.type || 'Experience',
    };
    const color = exp.displaySettings?.accentColor || catConfig.color || '#00d4ff';

    // Determine side: Admin override or alternating
    let side: 'left' | 'right' = idx % 2 === 0 ? 'left' : 'right';
    if (exp.displaySettings?.displaySide === 'left') side = 'left';
    if (exp.displaySettings?.displaySide === 'right') side = 'right';

    // Y position along trunk (newest at top, oldest at bottom)
    const y = topY - idx * nodeSpacing;
    const trunkPoint: [number, number, number] = [0, y, 0];

    // Branch endpoints in 3D world space
    const branchX = side === 'left' ? -2.6 : 2.6;
    const branchZ = Math.sin(idx * 1.1) * 0.35; // subtle depth offset
    const nodePoint: [number, number, number] = [branchX, y, branchZ];

    // Smooth cubic Bezier control points for the branch spline
    const controlPoint1: [number, number, number] = [
      side === 'left' ? -0.8 : 0.8,
      y + 0.2,
      branchZ * 0.3,
    ];
    const controlPoint2: [number, number, number] = [
      side === 'left' ? -1.8 : 1.8,
      y - 0.1,
      branchZ * 0.7,
    ];

    const curvePoints: [number, number, number][] = [
      trunkPoint,
      controlPoint1,
      controlPoint2,
      nodePoint,
    ];

    // Multi-position sub-branches layout
    const positionsLayout: PositionLayoutNode[] = [];
    if (exp.positions && exp.positions.length > 1) {
      const posCount = exp.positions.length;
      exp.positions.forEach((pos, pIdx) => {
        const subOffset = (pIdx - (posCount - 1) / 2) * 0.75;
        const subX = branchX + (side === 'left' ? -0.6 : 0.6);
        const subY = y + subOffset;
        const subZ = branchZ + (pIdx % 2 === 0 ? 0.2 : -0.2);

        positionsLayout.push({
          role: pos.role,
          posIdx: pIdx,
          startDate: pos.startDate,
          endDate: pos.endDate,
          current: pos.current,
          position: [subX, subY, subZ],
          metrics: pos.metrics,
        });
      });
    }

    const shortName =
      exp.shortName ||
      exp.company
        .split(' ')
        .map(w => w[0])
        .slice(0, 3)
        .join('')
        .toUpperCase();

    return {
      id: exp._id,
      experience: exp,
      index: idx,
      side,
      trunkPoint,
      nodePoint,
      curvePoints,
      color,
      category: exp.type || 'internship',
      shortName,
      isCurrent: !!exp.current,
      isFeatured: !!exp.featured,
      positionsCount: exp.positions?.length || 1,
      positionsLayout,
    };
  });

  const trunkStart: [number, number, number] = [0, bottomY - 1.5, 0];
  const trunkEnd: [number, number, number] = [0, topY + 2.0, 0];
  const presentDayPoint: [number, number, number] = [0, topY + 2.5, 0];

  return {
    nodes,
    trunkStart,
    trunkEnd,
    presentDayPoint,
    totalHeight: (topY - bottomY) + 4.5,
  };
}
