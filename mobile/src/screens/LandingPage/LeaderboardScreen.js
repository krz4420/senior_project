import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LeaderBoardScreen = (props) => {
  const isFocused = useIsFocused();
  const [users, setUsers] = useState([]);

  const fetchFeed = () => {
    axios
      .get(`${BACKENDPOINT}/Leaderboard?group=${props.route.params.groupName}`)
      .then((res) => {
        console.log(res.data);

        const sortedData = res.data.sort((x, y) => {
          return y.postCount - x.postCount;
        });
        console.log(sortedData);
        setUsers(sortedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (isFocused) {
      fetchFeed();
    }
  }, [isFocused]);

  const membersRanked = users.map((user, index) => {
    return (
      <>
        <View style={styles.tableRow} key={index}>
          <Text>{index + 1}</Text>
          <Text>{user.username}</Text>
          <Text style={{ alignSelf: "center" }}>{user.postCount}</Text>
        </View>
        <View
          style={[
            styles.divider,
            { marginBottom: 5, borderBottomColor: "#eaeaea" },
          ]}
        />
      </>
    );
  });

  return (
    <View>
      {users.length >= 1 ? (
        <View style={[styles.topThree, { marginBottom: 5 }]}>
          {users.length >= 2 ? (
            <View style={styles.second}>
              <View style={{ position: "relative" }}>
                <MaterialCommunityIcons
                  style={styles.avatar}
                  name={"account"}
                  size={90}
                />
                <MaterialCommunityIcons
                  style={[styles.trophy]}
                  name={"trophy"}
                  size={50}
                  color={"silver"}
                />
                <Text style={[styles.text, styles.third_text]}>2</Text>
              </View>
              <Text style={{ fontWeight: "bold" }}>{users[1].username}</Text>
            </View>
          ) : null}
          {users.length >= 1 ? (
            <View style={styles.first}>
              <View style={{ position: "relative" }}>
                <MaterialCommunityIcons
                  style={styles.avatar}
                  name={"account"}
                  size={135}
                />
                <MaterialCommunityIcons
                  style={styles.trophy}
                  name={"trophy"}
                  size={60}
                  color="gold"
                />
                <Text
                  style={[
                    { fontSize: 25, fontWeight: "bold" },
                    styles.third_text,
                  ]}
                >
                  1
                </Text>
              </View>

              <Text style={{ fontWeight: "bold" }}>{users[0].username}</Text>
            </View>
          ) : null}
          {users.length >= 3 ? (
            <View style={styles.third}>
              <View style={{ position: "relative" }}>
                <MaterialCommunityIcons
                  style={styles.avatar}
                  name={"account"}
                  size={90}
                />
                <MaterialCommunityIcons
                  style={styles.trophy}
                  name={"trophy"}
                  size={50}
                  color="#CD7F32"
                />
                <Text style={[styles.third_text, styles.text]}>3</Text>
              </View>
              <Text style={{ fontWeight: "bold" }}>{users[2].username}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
      <View style={[styles.divider]} />
      <View style={styles.col}>
        <Text style={styles.text}>Rank</Text>
        <Text style={styles.text}>Member</Text>
        <Text style={styles.text}>Posts</Text>
      </View>
      <View style={[styles.divider, { marginBottom: 5 }]} />
      <ScrollView style={styles.table}>{membersRanked}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    height: "100%",
  },
  divider: {
    borderBottomColor: "#cdcdcd",
    borderBottomWidth: 1,
    width: "100%",
    alignSelf: "center",
  },
  text: {
    fontWeight: "bold",
    fontSize: "18",
  },
  third_text: {
    position: "absolute",
    zIndex: 2,
    alignSelf: "center",
    bottom: 0,
    paddingBottom: 18,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 5,
  },
  avatar: {
    zIndex: 0,
  },
  trophy: {
    zIndex: 1,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  third: { alignItems: "center" },
  second: { alignItems: "center" },
  first: { alignItems: "center" },
  topThree: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  col: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    backgroundColor: "#e5e5e5",
  },
});

export default LeaderBoardScreen;
