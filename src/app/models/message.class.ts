export class Message {
    id: string;
    message: string;
    creator: string;
    avatar: string;
    timestamp: string | number;
    reactions?: object;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.message = obj ? obj.message : '';
        this.creator = obj ? obj.creator : '';
        this.avatar = obj ? obj.avatar : '';
        this.timestamp = obj ? obj.timestamp : '';
        this.reactions = obj ? obj.reactions : '';
    }

    setTimestampNow(): void {
        this.timestamp = Date.now();
    }

    setCreator(name: string): void {
        this.creator = name;
    }

    setAvatar(avatar: string): void {
        this.avatar = avatar;
    }

    setMessage(message: string): void {
        this.message = message;
    }

    setId(id: string): void {
        this.id = id;
    }

    public toJSON() {
        return {
            id: this.id,
            message: this.message,
            creator: this.creator,
            avatar: this.avatar,
            timestamp: this.timestamp,
            reactions: this.reactions,
        }
    }
}