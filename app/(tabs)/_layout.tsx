import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useCartStore } from '@/src/store/cartStore';

function CartIcon({ color }: { color: string }) {
  const totalItems = useCartStore(s => s.totalItems)();
  return (
    <View style={{ position: 'relative' }}>
      <Text style={{ fontSize: 22, color }}>🛒</Text>
      {totalItems > 0 && (
        <View style={{
          position: 'absolute', top: -4, right: -6,
          backgroundColor: '#4ADE80', borderRadius: 9,
          minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center',
          paddingHorizontal: 3,
        }}>
          <Text style={{ color: '#070D09', fontSize: 10, fontWeight: '800' }}>
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#070D09',
          borderTopColor: '#1E3A23',
          borderTopWidth: 1,
          paddingTop: 6,
          height: 84,
        },
        tabBarActiveTintColor: '#4ADE80',
        tabBarInactiveTintColor: '#374151',
        tabBarLabelStyle: { fontSize: 9, fontWeight: '700', marginBottom: 8 },
      }}
    >
      <Tabs.Screen name="index"       options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text> }} />
      <Tabs.Screen name="marketplace" options={{ title: 'Market',    tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🛍️</Text> }} />
      <Tabs.Screen name="cart"        options={{ title: 'Cart',      tabBarIcon: ({ color }) => <CartIcon color={color} /> }} />
      <Tabs.Screen name="orders"      options={{ title: 'Orders',    tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📦</Text> }} />
      <Tabs.Screen name="profile"     options={{ title: 'Profile',   tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>👤</Text> }} />
    </Tabs>
  );
}
