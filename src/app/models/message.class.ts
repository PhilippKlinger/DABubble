import { Timestamp } from "@angular/fire/firestore";

export class Message {
    id: string;
    message: string;
    creator: string;
    creatorId:string;
    avatar: string;
    timestamp: string | number;
    reactions?: object;
    answered_number: number;
    latest_answer: string | number;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.message = obj ? obj.message : '';
        this.creator = obj ? obj.creator : '';
        this.creatorId = obj ? obj.creatorId : '';
        this.avatar = obj ? obj.avatar : '';
        this.timestamp = obj ? obj.timestamp : '';
        this.reactions = obj ? obj.reactions : '';
        this.answered_number = obj ? obj.answered_number : '';
        this.latest_answer = obj ? obj.latest_answer : '';
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

    setAnwers(): void {
        this.answered_number = 0;
    }

    setLatestAnswer(timestamp: string | number): void {
        this.latest_answer = timestamp;
    }

    public toJSON() {
        return {
            id: this.id,
            message: this.message,
            creator: this.creator,
            creatorId: this.creatorId,
            avatar: this.avatar,
            timestamp: this.timestamp,
            reactions: this.reactions,
            answered_number: this.answered_number,
            latest_answer: this.latest_answer,
        }
    }
}