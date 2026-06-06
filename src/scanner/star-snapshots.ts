export type StarSnapshotItem = {
  fullName: string;
  starsTotal: number;
};

export type StarDelta = StarSnapshotItem & {
  starsAdded24h: number;
  isColdStart: boolean;
};

export const calculateStarDeltas = (
  current: StarSnapshotItem[],
  previous: StarSnapshotItem[]
): StarDelta[] => {
  const previousByName = new Map(previous.map((item) => [item.fullName, item.starsTotal]));

  return current
    .map((item) => {
      const previousStars = previousByName.get(item.fullName);
      const isColdStart = previousStars === undefined;

      return {
        ...item,
        starsAdded24h: isColdStart ? item.starsTotal : Math.max(0, item.starsTotal - previousStars),
        isColdStart
      };
    })
    .sort((left, right) => right.starsAdded24h - left.starsAdded24h);
};
