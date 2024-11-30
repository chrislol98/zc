import { Json } from "./types";

export class JsonManager {
  map: Map<Json['id'], Json> = new Map();
  collect(data: Json[]) {
    data.forEach(item => {
      this.map.set(item.id, item);
      if (item.children) {
        this.collect(item.children);
      }
    });
  }
}