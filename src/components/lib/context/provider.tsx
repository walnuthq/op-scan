"use client";
import { type ReactNode, useReducer } from "react";

import Context from "@/components/lib/context";
import { defaultState, reducer } from "@/components/lib/context/reducer";

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState());
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export default ContextProvider;
