import { useContext } from "react";

import GlobalContext from "@/components/lib/context";

const useGlobalContext = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const toggleTimestampFormattedAsDate = (): void =>
    dispatch({
      type: "TOGGLE_TIMESTAMP_FORMATTED_AS_DATE",
    });
  const toggleTxGasPriceShown = (): void =>
    dispatch({
      type: "TOGGLE_TX_GAS_PRICE_SHOWN",
    });
  const toggleUSDValueShown = (): void =>
    dispatch({
      type: "TOGGLE_USD_VALUE_SHOWN",
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
    toggleUSDValueShown,
    toggleTxGasPriceShown,
    setHoveredSelector,
    setHoveredAddress,
  };
};

export default useGlobalContext;
