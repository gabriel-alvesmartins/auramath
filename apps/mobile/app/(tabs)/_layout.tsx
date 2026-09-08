import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '../../../../src/theme/tokens';

export default function TabsLayout() {
  const handleTabPress = () => {
    try {
      Haptics.selectionAsync?.();
    } catch {
      // ignore
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primaryCyan,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
      screenListeners={{
        tabPress: handleTabPress,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trilha',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconGlow]}>
              <Text style={[styles.tabIcon, { color }]}>⚡</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="treino"
        options={{
          title: 'Treino',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconGlow]}>
              <Text style={[styles.tabIcon, { color }]}>⚔️</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="lab"
        options={{
          title: 'Lab',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconGlow]}>
              <Text style={[styles.tabIcon, { color }]}>📐</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconGlow]}>
              <Text style={[styles.tabIcon, { color }]}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(10, 13, 20, 0.95)',
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  activeIconGlow: {
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
  },
  tabIcon: {
    fontSize: 18,
  },
});
