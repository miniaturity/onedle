export async function getDailyWord(): Promise<string | undefined> {
    try {
        const res = await fetch("/api/dailyWord");
        
        if (!res.ok) {
            throw new Error('failed to load the daily word');
        }
        
        const word: string = await res.json();

        return word;
    } catch (err) {
        console.error(`Failed to load daily word: ${err}`);
    }
}



