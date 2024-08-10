import { useContext } from "react";

import Context from "@/components/lib/context";

const useGlobalContext = () => {
  const { state, dispatch } = useContext(Context);
  const toggleTimestampFormattedAsDate = (): void =>
    dispatch({
      type: "TOGGLE_TIMESTAMP_FORMATTED_AS_DATE",
    });
  const toggleTxGasPriceShown = (): void =>
    dispatch({
      type: "TOGGLE_TX_GAS_PRICE_SHOWN",
    });
  const setHoveredSelector = (selector: string): void =>
    dispatch({
      type: "SET_HOVERED_SELECTOR",
      payload: { selector },
    });
  const setHoveredAddress = (address: string): void =>
    dispatch({
      type: "SET_HOVERED_ADDRESS",
      payload: { address },
    });
  return {
    state,
    toggleTimestampFormattedAsDate,
    toggleTxGasPriceShown,
    setHoveredSelector,
    setHoveredAddress,
  };
};

export default useGlobalContext;
