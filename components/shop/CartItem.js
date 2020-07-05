import React from "react";
import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const CartItem = () => {
  return (
    <View>
      <Text>
        <Text>QTY</Text>
        <Text>TITLE</Text>
      </Text>
      <View>
        <Text>$AMOUNT</Text>
        <TouchableOpacity>
          <Ionicons
            name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
            size={22}
            color={Colors.red}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItem;
