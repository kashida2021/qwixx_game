export default class SixSidedDie{
    private _value: number = 0; 

    get value(): number{
        return this._value; 
    }

    rollDie(): void{
        this._value = Math.floor(Math.random()*6)+1
    }

}