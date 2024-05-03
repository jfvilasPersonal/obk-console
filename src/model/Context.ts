export class Context {
    public baseApiUrl: string = '';
    public username: string|null = null;
    public authenticated: boolean = false;

    constructor() {
        if ((window as any).context) {
            this.username=(window as any).context.username;
            this.authenticated=(window as any).context.authenticated;
            this.baseApiUrl=(window as any).context.baseApiUrl;
        }
    }

    public save() {
        (window as any).context=this;
    }

}