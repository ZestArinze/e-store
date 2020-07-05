import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
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
      const productTitle = addedProduct.title;

      let updatedOrNewCartItem;

      if (state.items[addedProduct.id]) {
        // item already in the cart. update it
        const cartItem = state.items[addedProduct.id];

        updatedOrNewCartItem = new CartItem(
          cartItem.quantity + 1,
          productPrice,
          productTitle,
          cartItem.sum + productPrice
        );
      } else {
        // item not in the cart. add it
        updatedOrNewCartItem = new CartItem(
          1,
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

      break;

    case REMOVE_FROM_CART:
      const currentQty = state.items[action.productId].quantity;
      const selectedCartItem = state.items[action.productId];

      let updatedCartItems;

      if (currentQty > 1) {
        // reduce qty
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );

        updatedCartItems = {
          ...state.items,
          [action.productId]: updatedCartItem,
        };
      } else {
        // delete item
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.productId];
      }

      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };
  }

  return state;
};
