"use client";
import { type ReactNode, useReducer } from "react";

import GlobalContext from "@/components/lib/context";
import { defaultState, reducer } from "@/components/lib/context/reducer";

const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState());
  return <GlobalContext value={{ state, dispatch }}>{children}</GlobalContext>;
};

export default GlobalContextProvider;
