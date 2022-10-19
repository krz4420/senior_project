import { StyleSheet, SafeAreaView } from 'react-native';
import Navigation from './src/navigation';
import { AuthProvider } from './src/context/Auth';

export default function App() {
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
    backgroundColor: '#F9FBFC',
    
  },
});
