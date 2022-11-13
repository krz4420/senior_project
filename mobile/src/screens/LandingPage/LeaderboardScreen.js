import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { BACKENDPOINT } from "../../utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const LeaderBoardScreen = (props) => {
  const isFocused = useIsFocused();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("All time");
  const fetchFeed = (startDate, endDate) => {
    axios
      .get(
        `${BACKENDPOINT}/Leaderboard?group=${props.route.params.groupName}&startDate=${startDate}&endDate=${endDate}`
      )
      // Data that we are handed back is an array of key value pairs in the form of username and postCount
      .then(({ data }) => {
        const { userPostCount, totalUsers } = data;
        console.log(userPostCount);
        console.log(totalUsers);
        // Sort the array by the postCount for each user
        const sortedData = userPostCount.sort((x, y) => {
          return y.postCount - x.postCount;
        });
        // Update the state to reflect the sorted array of users from those with the largest post count to smallest
        console.log(sortedData);
        totalUsers.map((user) => {
          console.log(user);
          if (
            !sortedData.some((userWhoPosted) => userWhoPosted.username == user)
          ) {
            sortedData.push({ postCount: 0, username: user });
          }
        });

        setUsers(sortedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // When the user navigates to this screen (we tell if isFocused is true) then we fetch leaderboard stats
  useEffect(() => {
    if (isFocused) {
      setFilter("All time");
      fetchFeed(Date.now(), null);
    }
  }, [isFocused]);

  // Helper function to handle finding the start and end date for the filtering functionality
  const handleFilter = (range) => {
    const startDate = new Date(Date.now());
    let endDate = null;

    switch (range) {
      case "All time":
        break;
      case "7 days":
        // endDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        endDate = new Date(Date.now() - 30 * 60 * 1000);

        break;
      case "30 days":
        endDate = new Date(Date.now() - 16 * 60 * 60 * 1000);

        // endDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
    }
    fetchFeed(startDate, endDate);
    setFilter(range);
  };

  const membersRanked = users.map((user, index) => {
    return (
      <View key={index}>
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
      </View>
    );
  });

  return (
    <View>
      {users.length >= 1 ? (
        <>
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
          <View style={[styles.divider]} />
          <View style={[styles.tableRow, { marginHorizontal: 60 }]}>
            <Pressable onPress={() => handleFilter("7 days")}>
              <Text style={filter == "7 days" ? styles.active : null}>
                7 days
              </Text>
            </Pressable>
            <Pressable onPress={() => handleFilter("30 days")}>
              <Text style={filter == "30 days" ? styles.active : null}>
                30 Days
              </Text>
            </Pressable>
            <Pressable onPress={() => handleFilter("All time")}>
              <Text style={filter == "All time" ? styles.active : null}>
                All Time
              </Text>
            </Pressable>
          </View>
        </>
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
  active: {
    fontWeight: "bold",
  },
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
