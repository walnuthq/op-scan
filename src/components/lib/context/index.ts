import { createContext } from "react";

import { defaultState, type Action } from "@/components/lib/context/reducer";

export default createContext({
  state: defaultState(),
  dispatch: (action: Action) => {},
});
