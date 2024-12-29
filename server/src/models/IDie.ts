export default interface IDie {
    readonly value: number;
    readonly active: boolean;

    rollDie(): number;
    disable(): void;
}