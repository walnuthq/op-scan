import { createContext } from "react";

import { defaultState, Action } from "@/components/lib/context/reducer";

export default createContext({
  state: defaultState(),
  dispatch: (action: Action) => {
    console.info(action);
  },
});
