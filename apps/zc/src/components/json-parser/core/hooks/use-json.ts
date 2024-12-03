import { useSyncExternalStore } from "react";
import { Json } from "../jsons/json";
import { useJsonManagerContext } from "./use-json-manager-context";

export function useJson(
  id: Json['id']
) {
  const jsonManager = useJsonManagerContext();
  return useSyncExternalStore(
    jsonManager.subscribe,
    () => jsonManager.get(id),
    () => jsonManager.get(id)
  )
}