import { JsonManagerContext } from "../contexts";
import { useContext } from "react";

export function useJsonManagerContext() {
  const context = useContext(JsonManagerContext);
  if (!context) {
    throw new Error('useJsonManagerContext must be used within a JsonManagerContext');
  }
  return context;
}
