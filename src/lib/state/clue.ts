import puzzles from "#lib/data/puzzles.json";

export type Clue = { guess: string; pattern: string; greens: number; yellows: number }; // pattern: b/y/g x5
