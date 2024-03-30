import React from "react";
import { Text, Platform, View, StyleSheet } from "react-native";
import { Home, League, Settings } from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 70,
    backgroundColor: "#fff", // Changed 'background' to 'backgroundColor'
  },
};

const styles = StyleSheet.create({
  tabBarIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarIconText: {
    fontSize: 12,
    color: "#16247d",
  },
  transactionTabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16247d",
    width: Platform.OS === "ios" ? 50 : 60,
    height: Platform.OS === "ios" ? 50 : 60,
    top: Platform.OS === "ios" ? -10 : -20,
    borderRadius: Platform.OS === "ios" ? 25 : 30,
  },
  tabBarIconContainer: {
    alignItems: 'center',
  },
  tabBarIconText: {
    fontSize: 12,
    color: '#111',
  },
});

const CustomTabBarIcon = ({ focused, iconName }) => (
  <View style={styles.tabBarIconContainer}>
    <MaterialIcons
      name={iconName}
      size={24}
      color={focused ? "#16247d" : "#111"}
    />
    <Text style={styles.tabBarIconText}>League</Text>
  </View>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabBarIconContainer}>
                <Entypo
                  name="home"
                  size={24}
                  color={focused ? "#16247d" : "#111"}
                />
                <Text style={styles.tabBarIconText}>HOME</Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="League"
          component={League}
          options={{
            tabBarIcon: ({ focused }) => (
              <CustomTabBarIcon focused={focused} iconName="sports-soccer" />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabBarIconContainer}>
                <Ionicons
                  name="settings"
                  size={24}
                  color={focused ? "#16247d" : "#111"}
                />
                <Text style={styles.tabBarIconText}>SETTINGS</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
