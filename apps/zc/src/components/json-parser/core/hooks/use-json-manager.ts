import { useState } from "react";
import { JsonManager } from "../json-manager";
import { Json } from "../jsons/json";

export function useJsonManager(data: Json[]) {
  const [jsonManager] = useState(() => {
    const jsonManager = new JsonManager();
    jsonManager.collect(data);
    return jsonManager;
  });
  return jsonManager;
}
