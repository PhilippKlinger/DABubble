export class Reaction {
    id: string;
    reaction: string;
    creator: string;
    amount: number;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.reaction = obj ? obj.reaction : '';
        this.creator = obj ? obj.creator : '';
        this.amount = obj ? obj.amount : '';
    }

    setAmount(number: number): void {
        this.amount = number;
    }

    setCreator(name: string): void {
        this.creator = name;
    }

    setReaction(reaction: string): void {
        this.reaction = reaction;
    }

    setId(id: string): void {
        this.id = id;
    }

    public toJSON() {
        return {
            id: this.id,
            reaction: this.reaction,
            creator: this.creator,
            amount: this.amount,
        }
    }
}