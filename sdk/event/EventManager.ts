export enum EventType {
    OnTick,
    OnDraw
}

class EventManager {

    private static readonly events: Map<EventType, any[]> = new Map<EventType, any[]>();



}

export default EventManager;