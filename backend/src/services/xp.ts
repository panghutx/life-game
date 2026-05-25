// src/services/xp.ts
// XP needed to reach a given level (cumulative)
export function xpForLevel(level: number): number {
  // Level 1: 0, Level 2: 100, Level 3: 300, Level 4: 600, Level 5: 1000...
  // Formula: sum of (level * 100) for levels 1 to level-1
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += i * 100;
  }
  return total;
}

// XP needed to advance from current level to next
export function xpToNextLevel(currentLevel: number): number {
  return currentLevel * 100;
}

// Calculate new level from total XP
export function calculateLevel(totalXp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

// Add XP and return { newTotal, newLevel, leveledUp }
export function addXp(currentTotalXp: number, currentLevel: number, xpToAdd: number) {
  const newTotalXp = currentTotalXp + xpToAdd;
  const newLevel = calculateLevel(newTotalXp);
  return {
    newTotalXp,
    newLevel,
    leveledUp: newLevel > currentLevel
  };
}
