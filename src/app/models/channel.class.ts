export class User {
    name: string;
    description: string;
    members: any[];
    creator: string;
   
    constructor(obj?: any) {
        this.name = obj ? obj.lastName : '';
        this.description = obj ? obj.description : '';
        this.members = obj ? obj.members : '';
        this.creator = obj ? obj.creator : '';
    }

    public toJSON() {
        return {
            name: this.name,
            description: this.description,
            members: this.members,
            creator: this.creator
        }
    }
}