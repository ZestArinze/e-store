import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import Card from "../../components/ui/Card";

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

  // get cart items from redux store
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];

    for (const key in state.cart.items) {
      const currentItem = state.cart.items[key];

      console.log(currentItem);

      transformedCartItems.push({
        productId: key,
        productTitle: currentItem.productTitle,
        productPrice: currentItem.productPrice,
        quantity: currentItem.quantity,
        sum: currentItem.sum,
      });
    }

    // return transformedCartItems.sort((a, b) =>
    //   a.productId > b.productId ? 1 : -1
    // );

    return transformedCartItems;
  });

  const dispatch = useDispatch();

  // duspatch action for creating an order
  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size='small' color={Colors.primary} />
        ) : (
          <Button
            title='Order Now'
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemdata) => (
          <CartItem
            quantity={itemdata.item.quantity}
            title={itemdata.item.productTitle}
            amount={itemdata.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemdata.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.accent,
  },
});

export default CartScreen;
