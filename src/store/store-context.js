import { createContext, useReducer } from "react";

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_NEARBY_STORES: "SET_NEARBY_STORES",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong };
    }
    case ACTION_TYPES.SET_NEARBY_STORES: {
      return { ...state, nearbyStores: action.payload.nearbyStores };
    }
    default:
      throw new Error(`unknown action type: ${action.type}`);
  }
};

export const StoreContext = createContext({
  state: { latLong: "", nearbyStores: [] },
  dispatch: () => {},
});

const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    nearbyStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
