import { createContext } from "react";

import { defaultState, type Action } from "@/components/lib/context/reducer";

export default createContext({
  state: defaultState(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: (action: Action) => {},
});
