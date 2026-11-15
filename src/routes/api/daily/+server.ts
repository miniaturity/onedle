import { json, type RequestHandler } from "@sveltejs/kit";
import {
	VALID_GUESSES,
	puzzleFor,
	secondsUntilNextPuzzle,
	todayNumber
} from "#lib/server/daily.js";

export const GET: RequestHandler = async () => {
	const { number, clue } = puzzleFor(todayNumber());
	return json(
		{ number, clue },
		{ headers: { "cache-control": `public, max-age=${Math.min(300, secondsUntilNextPuzzle())}` } }
	);
};

export const POST: RequestHandler = async ({ request }) => {
	let body: { guess?: unknown; number?: unknown };
	try {
		body = await request.json();
	} catch {
		return json({ error: "invalid JSON" }, { status: 400 });
	}

	const guess = typeof body.guess === "string" ? body.guess.trim().toUpperCase() : "";
	if (guess.length !== 5) return json({ valid: false, error: "Enter 5 letters" });
	if (!VALID_GUESSES.has(guess)) return json({ valid: false, error: "Not in word list" });

	const today = todayNumber();
	let number = today;
	if (typeof body.number === "number" && Number.isInteger(body.number)) {
		if (body.number < today - 1 || body.number > today) {
			return json({ error: "puzzle expired" }, { status: 410 });
		}
		number = body.number;
	}

	const { answer } = puzzleFor(number);
	return json(
		{ valid: true, correct: guess === answer, answer },
		{ headers: { "cache-control": "no-store" } }
	);
};