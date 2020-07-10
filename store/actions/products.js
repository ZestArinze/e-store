import { API_BASE_PATH, FIREBASE_PRODUCTS } from "../../constants/config";

export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";

export const createProduct = (title, description, imageUrl, price) => {
  return async (distapch) => {
    // execute aync code
    const response = await fetch(API_BASE_PATH + FIREBASE_PRODUCTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        imageUrl,
        price,
      }),
    });

    // extract response data
    const responseData = await response.json();

    console.log(responseData);

    distapch({
      // dispatch action afterwards
      type: CREATE_PRODUCT,
      productData: {
        id: responseData.name,
        title,
        description,
        imageUrl,
        price,
      },
    });
  };
};

export const updateProduct = (
  productId,
  title,
  description,
  imageUrl,
  price
) => {
  return {
    type: UPDATE_PRODUCT,
    productId,
    productData: {
      title,
      description,
      imageUrl,
    },
  };
};

export const deletProduct = (productId) => {
  return {
    type: DELETE_PRODUCT,
    productId: productId,
  };
};
