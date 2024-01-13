export class Reaction {
    id: string;
    reaction: string;
    creator: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.reaction = obj ? obj.reaction : '';
        this.creator = obj ? obj.creator : '';
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
        }
    }
}