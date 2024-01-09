export class Message {
    id: string;
    message: string;
    creator: string;
    timestamp: string | number;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.message = obj ? obj.message : '';
        this.creator = obj ? obj.creator : '';
        this.timestamp = obj ? obj.timestamp : '';
    }

    setTimestampNow(): void {
        this.timestamp = Date.now();
    }

    setCreator(): void {
        this.creator = 'Gast';
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
            timestamp: this.timestamp
        }
    }
}