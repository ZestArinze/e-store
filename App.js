import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import productReducer from "./store/reducers/products";
import ShopNavigator from "./navigation/ShopNavigator";
import { AppRegistry } from "react-native";

const rootReducer = combineReducers({
  products: productReducer,
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>
  );
}

AppRegistry.registerComponent("eStore", () => App);
