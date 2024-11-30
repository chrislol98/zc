import { createContext } from "react";
import { JsonManager } from "./json-manager";

export const JsonManagerContext = createContext<JsonManager | null>(null);
