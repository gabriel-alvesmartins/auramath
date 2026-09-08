import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { colors } from '../../../src/theme/tokens';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // Fallback system handles when custom fonts are not downloaded yet
  });

  return (
    <SafeAreaProvider>
      <View style={styles.rootContainer}>
        <StatusBar style="light" backgroundColor={colors.bgObsidian} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bgObsidian },
            animation: 'fade_from_bottom',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="lesson/[nodeId]"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen name="game/arena" options={{ headerShown: false }} />
          <Stack.Screen name="game/blitz" options={{ headerShown: false }} />
          <Stack.Screen name="game/sudden-death" options={{ headerShown: false }} />
          <Stack.Screen name="game/split-battle" options={{ headerShown: false }} />
          <Stack.Screen name="game/shadow-racing" options={{ headerShown: false }} />
          <Stack.Screen name="game/daily" options={{ headerShown: false }} />
          <Stack.Screen name="game/flash-anzan" options={{ headerShown: false }} />
          <Stack.Screen name="game/flow-zen" options={{ headerShown: false }} />
          <Stack.Screen name="game/boss" options={{ headerShown: false }} />
          <Stack.Screen
            name="game/result"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen name="teacher/index" options={{ headerShown: false }} />
          <Stack.Screen
            name="settings"
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: colors.bgObsidian,
  },
});
