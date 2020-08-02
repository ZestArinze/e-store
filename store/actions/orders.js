import { API_BASE_PATH, FIREBASE_ORDERS } from "../../constants/config";
import Order from "../../models/Order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

/**
 * fetch user's orders from server and 
 * dispatch redux action
 */
export const fetchOrders = () => {
  return async (dispatch, getState) => {
    try {

      const userId = getState().auth.userId;

      // execute aync code
      const response = await fetch(API_BASE_PATH + FIREBASE_ORDERS + `${userId}.json`);

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

      // dispatch redux action
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
      
    } catch (error) {
      // handle error
      throw error;
    }
  };
};

/**
 * 
 * dispatch action to place order for the current cart
 * 
 * @param cartItems items in the cart
 * @param totalAmount total amount of the cart items
 */
export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const date = new Date();

    try {
      const token = getState().auth.token;
      const userId = getState().auth.userId;

      // execute aync code
      const response = await fetch(
        API_BASE_PATH + FIREBASE_ORDERS + `${userId}.json?auth=${token}`,
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

      // check that response is OK (within 2xx range)
      if (!response.ok) {
        const errorData = await response.json();
        const errorId = errorData.error.message;

        //let message = "Something went wrong";

        throw new Error(errorData.error);
      }

      // extract response data
      const responseData = await response.json();

      console.log(responseData);

      // dispatch redux action
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
