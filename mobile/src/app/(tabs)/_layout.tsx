import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View, type ColorValue } from 'react-native';

import { useCart } from '@/store/cart';
import { colors, spacing } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabsLayout() {
  const { totalItems } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green700,
        tabBarInactiveTintColor: colors.mutedLight,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: (props) => <TabIcon name="home" {...props} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: (props) => <TabIcon name="grid" {...props} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: (props) => <TabIcon name="cart" badge={totalItems} {...props} />,
          tabBarAccessibilityLabel:
            totalItems > 0 ? `Cart, ${totalItems} item${totalItems === 1 ? '' : 's'}` : 'Cart, empty',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: (props) => <TabIcon name="receipt" {...props} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: (props) => <TabIcon name="person" {...props} />,
        }}
      />
    </Tabs>
  );
}

/**
 * Outline when inactive, filled when active — the standard mobile idiom, and it
 * reads at a glance without relying on colour alone.
 */
function TabIcon({
  name,
  color,
  focused,
  badge = 0,
}: {
  name: 'home' | 'grid' | 'cart' | 'receipt' | 'person';
  /** react-navigation hands us a ColorValue, not a plain string. */
  color: ColorValue;
  focused: boolean;
  badge?: number;
}) {
  const icon = (focused ? name : `${name}-outline`) as IoniconName;

  return (
    <View>
      <Ionicons name={icon} size={23} color={color} />
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
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    // Android draws no shadow from borderTop alone; lift the bar off the content.
    ...Platform.select({
      android: { elevation: 12, height: 62 },
      default: { height: 84 },
    }),
    paddingTop: spacing.sm,
  },
  item: { paddingVertical: 2 },
  label: { fontSize: 10.5, fontWeight: '700', marginTop: -2 },
  badge: {
    position: 'absolute',
    top: -5,
    right: -9,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.green700,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: { color: colors.white, fontSize: 9.5, fontWeight: '800' },
});
