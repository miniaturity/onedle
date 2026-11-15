import type { RequestHandler } from "@sveltejs/kit";
import seedrandom from "seedrandom";
import wordsText from "./words.txt?raw";

const words = wordsText
    .split(/\r?\n/)
    .map((w) => w.trim())
    .filter(Boolean); 

export const GET: RequestHandler = async () => {
    if (words.length === 0) {
        return new Response(JSON.stringify({ error: "word list is empty" }), {
            status: 500,
            headers: { "content-type": "application/json" }
        });
    }

    const today = new Date().toISOString().slice(0, 10);
    const index = seededIndex(words.length, today);

    return Response.json(words[index], {
        headers: { 'cache-control': 'public, max-age=300' }
    });
};

function seededIndex(len: number, seed: string): number {
    const rng = seedrandom(seed);
    return Math.floor(rng() * len);
}