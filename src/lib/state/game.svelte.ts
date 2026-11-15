import { getDailyWord } from "./words";
import wordsText from "./words.txt?raw";

const WORDS = wordsText
    .split(/\r?\n/)
    .map((w) => w.trim())
    .filter(Boolean); 
 
const WORD_LEN = 5

type Mode = "unlimited" | "daily";
type KeyState = "gray" | "yellow" | "green" | "na";
type Key = { c: string, col: KeyState };
type GameStatus = "playing" | "menu" | "solved"


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

    private _word: string | undefined = $state();
    private _clue: string | undefined = $state();
    private _guess: string = $state("");
    private _keys: Key[][] = $state([]);
    private _timeElapsed_ms: number = $state(0);
    
    get word(): string | undefined {
        return this._word;
    }

    get guess(): string {
        return this._guess;
    }

    set guess(n: string) {
        if (n.length < WORD_LEN) {
            this._guess = n;
        }
    }

    get keys(): Key[][] {
        return this._keys;
    }

    setKeyState(key: string, col: KeyState) {
        this._keys = this._keys.map(j => j.map(
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

    constructor() {
        this._keys = DEFAULT_KEYS;
    }

}


class DailyGame extends GameState {
    
} 