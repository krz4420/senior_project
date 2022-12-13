import { StyleSheet, SafeAreaView } from "react-native";
import Navigation from "./src/navigation";
import { AuthProvider } from "./src/context/Auth";
import registerNNPushToken from "native-notify";

export default function App() {
  registerNNPushToken(5265, "pTgKmSYDGmIgRDPErMxATx");

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <Navigation />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
