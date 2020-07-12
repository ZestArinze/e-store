import { API_BASE_PATH, FIREBASE_PRODUCTS } from "../../constants/config";
import Product from "../../models/Product";

export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const SET_PRODUCTS = "GET_PRODUCTS";

export const getProducts = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId;

      // execute aync code
      const response = await fetch(API_BASE_PATH + FIREBASE_PRODUCTS + ".json");

      // check that response is OK (within 2xx range)
      if (!response.ok) {
        throw new Error("Error making network request!");
      }

      // extract response data
      const responseData = await response.json();
      const loadedProducts = [];

      for (const key in responseData) {
        const data = responseData[key];

        loadedProducts.push(
          new Product(
            key,
            data.ownerId,
            data.title,
            data.imageUrl,
            data.description,
            data.price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(
          (product) => product.ownerId === userId
        ),
      });
    } catch (error) {
      // handle error
      throw error;
    }
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const userId = getState().auth.userId;

      // execute aync code
      const response = await fetch(
        API_BASE_PATH + FIREBASE_PRODUCTS + ".json?auth=" + token,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            imageUrl,
            price,
            ownerId: userId,
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
        // dispatch action afterwards
        type: CREATE_PRODUCT,
        productData: {
          id: responseData.name,
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        },
      });
    } catch (e) {
      throw e;
    }
  };
};

export const updateProduct = (
  productId,
  title,
  description,
  imageUrl,
  price
) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const url =
        API_BASE_PATH + FIREBASE_PRODUCTS + `${productId}.json?auth=${token}`;

      // execute aync code
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      });

      // check that response is OK (within 2xx range)
      if (!response.ok) {
        throw new Error("Error making network request!");
      }

      dispatch({
        type: UPDATE_PRODUCT,
        productId,
        productData: {
          title,
          description,
          imageUrl,
        },
      });
    } catch (e) {
      throw e;
    }
  };
};

export const deletProduct = (productId) => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const url = API_BASE_PATH + `products/${productId}.json?auth=${token}`;

      // execute aync code
      const response = await fetch(url, {
        method: "DELETE",
      });

      // check that response is OK (within 2xx range)
      if (!response.ok) {
        throw new Error("Error making network request!");
      }

      dispatch({
        type: DELETE_PRODUCT,
        productId: productId,
      });
    } catch (e) {
      throw e;
    }
  };
};
