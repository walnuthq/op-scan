export type State = {
  timestampFormattedAsDate: boolean;
  usdValueShown: boolean;
  txGasPriceShown: boolean;
  hoveredSelector: string;
  hoveredAddress: string;
};

export const defaultState = (): State => ({
  timestampFormattedAsDate: false,
  usdValueShown: false,
  txGasPriceShown: false,
  hoveredSelector: "",
  hoveredAddress: "",
});

export type Action =
  | {
      type: "TOGGLE_TIMESTAMP_FORMATTED_AS_DATE";
    }
  | { type: "TOGGLE_USD_VALUE_SHOWN" }
  | { type: "TOGGLE_TX_GAS_PRICE_SHOWN" }
  | { type: "SET_HOVERED_SELECTOR"; payload: { selector: string } }
  | { type: "SET_HOVERED_ADDRESS"; payload: { address: string } };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_TIMESTAMP_FORMATTED_AS_DATE": {
      return {
        ...state,
        timestampFormattedAsDate: !state.timestampFormattedAsDate,
      };
    }
    case "TOGGLE_USD_VALUE_SHOWN": {
      return {
        ...state,
        usdValueShown: !state.usdValueShown,
      };
    }
    case "TOGGLE_TX_GAS_PRICE_SHOWN": {
      return {
        ...state,
        txGasPriceShown: !state.txGasPriceShown,
      };
    }
    case "SET_HOVERED_SELECTOR": {
      return {
        ...state,
        hoveredSelector: action.payload.selector,
      };
    }
    case "SET_HOVERED_ADDRESS": {
      return {
        ...state,
        hoveredAddress: action.payload.address,
      };
    }
    default: {
      return state;
    }
  }
};
