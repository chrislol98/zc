import { useState } from "react";
import { JsonManager } from "../json-manager";

export function useJsonManager() {
  const [jsonManager] = useState(() => {
    const jsonManager = new JsonManager();
    return jsonManager;
  });
  return jsonManager;
}
