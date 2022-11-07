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
      <View style={styles.tableRow} key={index}>
        <Text>{index + 1}</Text>
        <Text>{user.username}</Text>
        <Text>{user.postCount}</Text>
      </View>
    );
  });

  return (
    <View>
      <View style={styles.topThree}>
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
          <Text>Joe</Text>
        </View>
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
              style={[{ fontSize: 25, fontWeight: "bold" }, styles.third_text]}
            >
              1
            </Text>
          </View>

          <Text>Mama</Text>
        </View>
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
          <Text>Kyle</Text>
        </View>
      </View>
      <View style={styles.col}>
        <Text style={styles.text}>Rank</Text>
        <Text style={styles.text}>Member</Text>
        <Text style={styles.text}>Posts</Text>
      </View>
      <ScrollView>{membersRanked}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginHorizontal: 20,
  },
});

export default LeaderBoardScreen;
