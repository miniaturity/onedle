export type LetterState = "green" | "yellow" | "gray" | "na"
export type Letter = { c: string, state: LetterState }
 

class GameState {
    word = $state<string>("words");
}