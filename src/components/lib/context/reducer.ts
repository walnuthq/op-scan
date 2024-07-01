export type State = {
  timestampFormattedAsDate: boolean;
  txGasPriceShown: boolean;
  hoveredSelector: string;
};

export const defaultState = (): State => ({
  timestampFormattedAsDate: false,
  txGasPriceShown: false,
  hoveredSelector: "",
});

export type Action =
  | {
      type: "TOGGLE_TIMESTAMP_FORMATTED_AS_DATE";
    }
  | { type: "TOGGLE_TX_GAS_PRICE_SHOWN" }
  | { type: "SET_HOVERED_SELECTOR"; payload: { selector: string } };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_TIMESTAMP_FORMATTED_AS_DATE": {
      return {
        ...state,
        timestampFormattedAsDate: !state.timestampFormattedAsDate,
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
    default: {
      return state;
    }
  }
};
