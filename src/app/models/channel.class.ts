export class Channel {
    id: string;
    name: string;
    description: string;
    members: any[];
    creator: string;
    timestamp: number;
   
    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.members = obj ? obj.members : '';
        this.creator = obj ? obj.creator : '';
        this.timestamp = obj ? obj.timestamp : '';
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            members: this.members,
            creator: this.creator,
            timestamp: this.timestamp
        }
    }
}