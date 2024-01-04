export class Channel {
    id: string;
    name: string;
    description: string;
    members: any[];
    creator: string;
    timestamp: string | number;
   
    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.description = obj ? obj.description : '';
        this.members = obj ? obj.members : '';
        this.creator = obj ? obj.creator : '';
        this.timestamp = obj ? obj.timestamp : '';
    }

    setTimestampNow(): void {
        this.timestamp = Date.now();
      }

    setCreator(): void {
        this.creator = 'Test User';
    }

    addCreatorToMembers(): void {
        this.members = [{email: 'testuser@dev.com', id: '11sdf1s6f1s6f1', name: 'Test User', avatar: 'assets/avatars/avatar_0.svg' }];
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