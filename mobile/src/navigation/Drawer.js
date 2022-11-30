import * as React from "react";
import { View, SafeAreaView, StyleSheet } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import TabNav from "./Tab";
import JoinGroupScreen from "../screens/LandingPage/JoinGroupScreen";
import CreateGroupScreen from "../screens/LandingPage/CreateGroupScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/Auth";

const Drawer = createDrawerNavigator();

// Navigator for the side drawer which displays the add/join group, groups and signout
function CustomDrawerContent(props) {
  const auth = useAuth();

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.separator} />
      <View>
        <DrawerItem
          label={"Logout"}
          onPress={() => auth.signOut()}
          icon={() => (
            <MaterialCommunityIcons name="logout-variant" size={20} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const DrawNav = () => {
  const auth = useAuth();
  const group = auth.authData.groups;

  const list =
    group != null
      ? group.map((groupName) => (
          <Drawer.Screen
            key={groupName}
            name={groupName}
            component={TabNav}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="select-group"
                  color={color}
                  size={20}
                />
              ),
            }}
          />
        ))
      : null;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
    >
      {list}

      <Drawer.Screen
        name="Join Group"
        component={JoinGroupScreen}
        options={{
          drawerLabel: "Join Group",
          drawerItemStyle: styles.separator,
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={20}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Create Group"
        component={CreateGroupScreen}
        options={{
          drawerLabel: "Create Group",
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              color={color}
              size={20}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
const styles = StyleSheet.create({
  separator: {
    marginVertical: 8,
    borderTopColor: "#737373",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});

export default DrawNav;
