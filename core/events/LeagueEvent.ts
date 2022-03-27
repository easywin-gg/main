export enum EventType {
    OnOpen,
    OnClose,
}

class LeagueEventManager {

    private readonly subscriptions: Map<EventType, any[]> = new Map();

    subscribe(eventType: EventType, callback: any) {
        if (this.subscriptions.has(eventType)) {
            this.subscriptions.get(eventType)?.push(callback)
            return;
        }

        this.subscriptions.set(eventType, [callback]);
    }

    unsubscribe(eventType: EventType, callback: any) {
        if (!this.subscriptions.has(eventType)) return;
        
        const callbacks = this.subscriptions.get(eventType);
        const index = callbacks?.findIndex((eventCallback) => eventCallback === callback);
        if (index) {
            this.subscriptions.get(eventType)?.splice(index, 1);
        }
    }

    publish(eventType: EventType, args: any) {
        if (!this.subscriptions.has(eventType)) return;
        this.subscriptions.get(eventType)?.forEach(callback => callback(args));
    }

}

export default LeagueEventManager;