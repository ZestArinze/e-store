export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";

/**
 * dispatch redux action for adding a new product
 * @param product Product to add to cart
 */
export const addToCart = (product) => {
  return { type: ADD_TO_CART, product: product };
};

/**
 * dispatch redux action for removing product from the cart
 * @param productId id of the product ro remove
 */
export const removeFromCart = (productId) => {
  return { type: REMOVE_FROM_CART, productId: productId };
};
