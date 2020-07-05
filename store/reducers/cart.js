import { ADD_TO_CART } from "../actions/cart";
import CartItem from "../../models/CartItem";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.productTitle;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // item already in the cart. update it
        const cartItem = state.items[addedProduct.id];
        updatedOrNewCartItem = new CartItem(
          cartItem.quantity + 1,
          productPrice,
          productTitle,
          cartItem + productPrice
        );
      } else {
        // item not in the cart. add it
        updatedOrNewCartItem = new CartItem(
          addedProduct.id,
          productPrice,
          productTitle,
          productPrice
        );
      }

      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedOrNewCartItem },
        totalAmount: state.totalAmount + productPrice,
      };
  }

  return state;
};
