import { Json } from "./jsons/json";

export class JsonManager {
  private map: Map<Json['id'], Json> = new Map();
  private subscribers: Set<() => void> = new Set();
  
  get(id: Json['id']) {
    return this.map.get(id);
  }
  subscribe = (listener: () => void): () => void => {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  };
  collect(data: Json[]) {
    data.forEach(item => {
      this.map.set(item.id, item);
      if (item.children) {
        this.collect(item.children);
      }
    });
  }
}