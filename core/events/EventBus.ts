export enum EventType {
    OnLoad,
    OnUnload,
    OnTick,
    OnDraw
}

class EventBus {

    private readonly subscriptions: Map<EventType, any[]> = new Map();

    subscribe(eventType: EventType, callback: any) {
        if(this.subscriptions.has(eventType)) {
            this.subscriptions.get(eventType)?.push(callback)
            return;
        }

        this.subscriptions.set(eventType, [callback]);
    }

    publish(eventType: EventType, args: any) {
        if(!this.subscriptions.has(eventType)) return;
        this.subscriptions.get(eventType)?.forEach(callback=> callback(args));
    }

}

export default EventBus;