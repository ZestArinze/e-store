import {
  FIREBASE_ORDERS,
  FIREBASE_AUTH_WEB_API_KEY,
} from "../../constants/config";

export const SIGN_UP = "SIGN_UP";
export const LOGIN = "LOGIN";

export const signUp = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_AUTH_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;

      let message = "Something went wrong";

      if (errorId === "EMAIL_EXISTS") {
        message = "Email already exists";
      }

      throw new Error(message);
    }

    const responseData = await response.json();
    console.log(responseData);

    dispatch({
      type: SIGN_UP,
      token: responseData.idToken,
      userId: responseData.localId,
    });
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_AUTH_WEB_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorId = errorData.error.message;

      let message = "Something went wrong";

      if (errorId === "EMAIL_NOT_FOUND") {
        message = "Email not found";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "Password is invalid";
      }

      throw new Error(message);
    }

    const responseData = await response.json();
    console.log(responseData);

    dispatch({
      type: LOGIN,
      token: responseData.idToken,
      userId: responseData.localId,
    });
  };
};
