import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View, type ColorValue } from 'react-native';

import { useCart } from '@/store/cart';
import { colors, spacing, type } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];
type TabName = 'home' | 'grid' | 'cart' | 'receipt' | 'person';

export default function TabsLayout() {
  const { totalItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.leaf,
        tabBarInactiveTintColor: colors.faint,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: (p) => <TabIcon name="home" {...p} /> }}
      />
      <Tabs.Screen
        name="categories"
        options={{ title: 'Categories', tabBarIcon: (p) => <TabIcon name="grid" {...p} /> }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: (p) => <TabIcon name="cart" badge={totalItems} {...p} />,
          tabBarAccessibilityLabel:
            totalItems > 0 ? `Cart, ${totalItems} item${totalItems === 1 ? '' : 's'}` : 'Cart, empty',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Orders', tabBarIcon: (p) => <TabIcon name="receipt" {...p} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: (p) => <TabIcon name="person" {...p} /> }}
      />
    </Tabs>
  );
}

/**
 * Outline when idle, solid when active — the standard idiom, and it reads
 * without relying on colour alone.
 */
function TabIcon({
  name,
  color,
  focused,
  badge = 0,
}: {
  name: TabName;
  color: ColorValue;
  focused: boolean;
  badge?: number;
}) {
  const icon = (focused ? name : `${name}-outline`) as IoniconName;

  return (
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={22} color={color} />
      {badge > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    // Android draws no shadow from a top border alone; lift the bar instead.
    ...Platform.select({
      android: { elevation: 16, height: 64 },
      default: { height: 86 },
    }),
    paddingTop: spacing.sm,
  },
  item: { paddingVertical: 2 },
  label: { ...type.tiny, fontSize: 10, marginTop: -1 },
  iconWrap: { width: 34, alignItems: 'center' },
  badge: {
    position: 'absolute',
    top: -5,
    right: 0,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.paper,
  },
  badgeText: {
    ...type.tiny,
    fontSize: 9,
    lineHeight: 12,
    color: colors.onDark,
    includeFontPadding: false,
  },
});
