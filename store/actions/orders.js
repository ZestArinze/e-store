import { API_BASE_PATH, FIREBASE_ORDERS } from "../../constants/config";
import Order from "../../models/Order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch) => {
    try {
      // execute aync code
      const response = await fetch(API_BASE_PATH + FIREBASE_ORDERS + "u1.json");

      // check that response is OK (within 2xx range)
      if (!response.ok) {
        throw new Error("Error making network request!");
      }

      // extract response data
      const responseData = await response.json();
      const loadedOrders = [];

      console.log(responseData);

      for (const key in responseData) {
        const data = responseData[key];
        loadedOrders.push(
          new Order(key, data.items, data.amount, new Date(data.date))
        );
      }

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (error) {
      // handle error
      throw error;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch) => {
    const date = new Date();

    try {
      // execute aync code
      const response = await fetch(
        API_BASE_PATH + FIREBASE_ORDERS + "u1.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: cartItems,
            amount: totalAmount,
            date: date.toISOString(),
          }),
        }
      );

      // extract response data
      const responseData = await response.json();

      // check that response is OK (within 2xx range)
      if (!response.ok) {
        throw new Error("Error making network request!");
      }

      console.log(responseData);

      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: responseData.name,
          items: cartItems,
          amount: totalAmount,
          date: date,
        },
      });
    } catch (e) {
      throw e;
    }
  };
};
