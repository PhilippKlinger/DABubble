export class User {
    name: string;
    email: string;
    avatar: string;  //bild auf firestore laden oder pfad zu datei anzeigen??
    onlineStatus: boolean = false;

    constructor(obj?: any) {
        this.name = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.avatar = obj ? obj.avatar : '';
        this.onlineStatus = obj ? obj.onlineStatus : '';
    }

    public toJSON() {
        return {
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            onlineStatus: this.onlineStatus
        }
    }
}