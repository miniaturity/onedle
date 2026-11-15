import { Clue } from "./clue";
import { browser } from "$app/env";
import { getDaily, submitGuess, type DailyPuzzle } from "./words";

import wordsText from "./words.txt?raw";
import xordsText from "./xords.txt?raw";

const STORAGE_KEY = "onedle-daily-result-v1";
const WORD_LEN = 5

type Mode = "unlimited" | "daily";
type KeyState = "gray" | "yellow" | "green" | "na";
type Key = { c: string, col: KeyState };
type GameStatus = "playing" | "menu" | "won" | "lost" | "loading" | "error" | "submitting"
type Saved = { number: number; guess: string; correct: boolean; answer: string };

const VALID = new Set(
	(wordsText + "\n" + xordsText).split(/\r?\n/).map((w) => w.trim().toUpperCase()).filter(Boolean)
);


const DEFAULT_KEYS: Key[][] = [
    [
        { c: "q", col: "na" },
        { c: "w", col: "na" },
        { c: "e", col: "na" },
        { c: "r", col: "na" },
        { c: "t", col: "na" },
        { c: "y", col: "na" },
        { c: "u", col: "na" },
        { c: "i", col: "na" },
        { c: "o", col: "na" },
        { c: "p", col: "na" }
    ],
    [
        { c: "a", col: "na" },
        { c: "s", col: "na" },
        { c: "d", col: "na" },
        { c: "f", col: "na" },
        { c: "g", col: "na" },
        { c: "h", col: "na" },
        { c: "j", col: "na" },
        { c: "k", col: "na" },
        { c: "l", col: "na" }
    ],
    [
        { c: "del", col: "na" },
        { c: "z", col: "na" },
        { c: "x", col: "na" },
        { c: "c", col: "na" },
        { c: "v", col: "na" },
        { c: "b", col: "na" },
        { c: "n", col: "na" },
        { c: "m", col: "na" },
        { c: "go", col: "na" }
    ]
]

class GameState {
    public status: GameStatus = $state("menu");

    word = $state<string>();
    answer = $state<string>();
    puzzle = $state<DailyPuzzle>();
    guess = $state<string>("");
    keys = $state<Key[][]>([]);
    timeElapsed_ms = $state<number>(0);

    public error: string = $state("");
    public message: string = $state("");

    public finalGuess: string = $state("");
    
    get done() {
		return this.status === "won" || this.status === "lost";
	}

    setKeyState(key: string, col: KeyState) {
        this.keys = this.keys.map(j => j.map(
            k => k.c === key ? { ...k, col } : k 
        ));
    }

    guessBackspace() {
        if (this.guess.length == 1) return;
        this.guess = this.guess.slice(0, -1);
    }

    guessClear() {
        this.guess = "";
    }

    async init() {
		if (!browser) return;
		this.status = "loading";
		this.message = "";

		const puzzle = await getDaily();
		if (!puzzle) {
			this.status = "error";
			this.message = "Couldn't load today's puzzle.";
			return;
		}
		this.puzzle = puzzle;

		const saved = this.readSaved();
		if (saved && saved.number === puzzle.number) {
			this.finalGuess = saved.guess;
			this.answer = saved.answer;
			this.status = saved.correct ? "won" : "lost";
			return;
		}
		this.status = "playing";
	}

    type(letter: string) {
		if (this.status !== "playing") return;
		if (!/^[a-z]$/i.test(letter) || this.guess.length >= WORD_LEN) return;
		this.guess += letter.toUpperCase();
		this.message = "";
	}

    async submit() {
		if (this.status !== "playing" || !this.puzzle) return;
		if (this.guess.length !== WORD_LEN) {
			this.message = "Enter 5 letters";
			return;
		}

		const guess = this.guess;
		this.status = "submitting";
		const result = await submitGuess(guess, this.puzzle.number);

		if (!result) {
			this.status = "playing";
			this.message = "Couldn't reach the server. If it persists, reload the page.";
			return;
		}
		if (!result.valid) {
			this.status = "playing";
			this.message = result.error;
			return;
		}

		this.finalGuess = guess;
		this.answer = result.answer;
		this.status = result.correct ? "won" : "lost";
		this.writeSaved({
			number: this.puzzle.number,
			guess,
			correct: result.correct,
			answer: result.answer
		});
	}

    private readSaved(): Saved | undefined {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? (JSON.parse(raw) as Saved) : undefined;
		} catch {
			return undefined;
		}
	}

	private writeSaved(s: Saved) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
		} catch {
			
		}
	}

    constructor() {
        this.keys = DEFAULT_KEYS;
    }

}


class DailyGame extends GameState {
    
} 