import { AsyncStorage } from "react-native";

import {
  FIREBASE_ORDERS,
  FIREBASE_AUTH_WEB_API_KEY,
} from "../../constants/config";

// export const SIGN_UP = "SIGN_UP";
// export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
let timer;

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

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

    const token = responseData.idToken;
    const userId = responseData.localId;

    dispatch(
      authenticate(
        responseData.localId,
        responseData.idToken,
        parseInt(responseData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      Date().getTime() + parseInt(responseData.expiresIn) * 1000
    );
    saveDataToStorage(token, userId, expirationDate);
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

    const token = responseData.idToken;
    const userId = responseData.localId;

    dispatch(
      authenticate(
        responseData.localId,
        responseData.idToken,
        parseInt(responseData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(responseData.expiresIn) * 1000
    );

    saveDataToStorage(token, userId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
