import { useState } from "react";
import globalContext from "../global-context";

export const useGlobalState = (uid: string, key: string, defaultValue?: any) => {
  key = (uid || '$') + '.' + key;
  const state = useState(() => globalContext.get(key, defaultValue));
  globalContext.set(key, state[0]);
  return state;
};
