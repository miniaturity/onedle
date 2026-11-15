export type DailyPuzzle = {
	number: number;
	clue: { guess: string; pattern: string }; // b/y/g x 5
};

export type GuessResult =
	| { valid: false; error: string }
	| { valid: true; correct: boolean; answer: string };

export async function getDaily(): Promise<DailyPuzzle | undefined> {
	try {
		const res = await fetch("/api/daily");
		if (!res.ok) throw new Error(`status ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error(`Failed to load daily puzzle: ${err}`);
	}
}

export async function submitGuess(guess: string, number: number): Promise<GuessResult | undefined> {
	try {
		const res = await fetch("/api/daily", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ guess, number })
		});
		if (!res.ok) throw new Error(`status ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error(`Failed to submit guess: ${err}`);
	}
}