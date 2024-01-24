export class DMInfo {
    chatPartner: string;
    chatPartnerId: string;
    docId: string;

    constructor(obj?: any) {
        this.chatPartner = obj ? obj.chatPartner : '';
        this.chatPartnerId = obj ? obj.chatPartnerId : '';
        this.docId = obj ? obj.docId : '';
    }

    setChatPartner(name: string): void {
        this.chatPartner = name;
    }

    setChatPartnerId(id: string): void {
        this.chatPartnerId = id;
    }

    setDocId(id: string): void {
        this.docId = id;
    }

    public toJSON() {
        return {
            chatPartner: this.chatPartner,
            chatPartnerId: this.chatPartnerId,
            docId: this.docId,
        }
    }
}