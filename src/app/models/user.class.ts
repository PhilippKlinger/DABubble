export class User {
    id: string;
    name: string;
    oldPassword: string;
    password: string;
    confirmPassword: string;
    email: string;
    avatar: string;  //bild auf firestore laden oder pfad zu datei anzeigen??
    onlineStatus: boolean = false;

    constructor(obj?: any) {
        this.id = obj ? obj.id : '';
        this.name = obj ? obj.name : '';
        this.oldPassword = obj ? obj.oldPassword : '';
        this.password = obj ? obj.password : '';
        this.confirmPassword = obj ? obj.confirmPassword : '';
        this.email = obj ? obj.email : '';
        this.avatar = obj ? obj.avatar : '';
        this.onlineStatus = obj ? obj.onlineStatus : '';
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            avatar: this.avatar,
            onlineStatus: this.onlineStatus
        }
    }
}