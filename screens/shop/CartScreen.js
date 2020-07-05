import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import { StyleSheet, View, Text, Button, FlatList } from "react-native";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";

const CartScreen = () => {
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);

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

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        <Button title='Order Now' disabled={cartItems.length === 0} />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemdata) => (
          <CartItem
            quantity={itemdata.item.quantity}
            title={itemdata.item.productTitle}
            amount={itemdata.item.sum}
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemdata.item.productId));
            }}
          />
        )}
      />
    </View>
  );
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
    shadowColor: Colors.black,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: Colors.white,
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
