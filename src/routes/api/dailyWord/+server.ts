import type { RequestHandler } from "@sveltejs/kit";
import seedrandom from "seedrandom";

export const GET: RequestHandler = async ({ platform }) => {
    const today = new Date().toISOString().slice(0, 10);
    const PATH = "";
    let words: string[] = [];

    try {
        const res = await fetch(PATH);

        if (!res.ok) throw new Error(`Failed to fetch word: ${res.status}`);

        const text = await res.text();
        words = text.split(/\r?\n/);
    } catch (err) {
        console.error(`Error fetching word: ${err}`);
    }

    const index = seededIndex(words.length, today);
    return Response.json(words[index], {
        headers: { 'cache-control': 'public, max-age=300' }
    });
}

function seededIndex(len: number, seed: string): number {
    const rng = seedrandom(seed);
    return Math.floor(rng() * len);
}