import seedrandom from "seedrandom";
import puzzles from "#lib/data/puzzles.json";
import wordsText from "#lib/words.txt?raw";
import xordsText from "#lib/xords.txt?raw";

type Clue = { guess: string; pattern: string; greens: number; yellows: number };
const data = puzzles as Record<string, Clue[]>;

const DAY_MS = 86_400_000;
const LAUNCH = Date.UTC(2026, 10, 14);
const SHUFFLE_SEED = "daily-v1";

const parse = (t: string) =>
	t.split(/\r?\n/).map((w) => w.trim().toUpperCase()).filter((w) => w.length === 5);

export const VALID_GUESSES = new Set([...parse(wordsText), ...parse(xordsText)]);

const ORDER = (() => {
	const list = Object.keys(data).sort();
	const rng = seedrandom(SHUFFLE_SEED);
	for (let i = list.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[list[i], list[j]] = [list[j], list[i]];
	}
	return list;
})();

export function todayNumber(now = Date.now()): number {
	return Math.floor((now - LAUNCH) / DAY_MS);
}

export function puzzleFor(n: number) {
	const len = ORDER.length;
	const answer = ORDER[((n % len) + len) % len];
	const { guess, pattern } = data[answer][0]; 
	return { number: n, answer, clue: { guess, pattern } };
}

export function secondsUntilNextPuzzle(now = Date.now()): number {
	const next = LAUNCH + (todayNumber(now) + 1) * DAY_MS;
	return Math.max(1, Math.ceil((next - now) / 1000));
}