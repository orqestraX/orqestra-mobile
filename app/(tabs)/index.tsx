import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';

const STATS = [
  { label: 'Active Orders', value: '3', delta: '+1 today', color: '#4ADE80' },
  { label: 'Pending', value: '2', delta: 'awaiting', color: '#FACC15' },
  { label: 'Completed', value: '18', delta: 'this month', color: '#60A5FA' },
];

const ACTIVITY = [
  {
    id: '1', type: 'order', icon: '📦',
    title: 'Order #ORQ-0041 confirmed',
    sub: 'Blue Dream — 10 lbs · High Desert Farms',
    time: '2h ago', color: '#4ADE80',
  },
  {
    id: '2', type: 'shipment', icon: '🚚',
    title: 'Shipment in transit',
    sub: 'Order #ORQ-0039 · ETA tomorrow 3pm',
    time: '5h ago', color: '#FACC15',
  },
  {
    id: '3', type: 'listing', icon: '🌿',
    title: 'New listing near you',
    sub: 'OG Kush Greenhouse — 120 lbs available',
    time: '1d ago', color: '#60A5FA',
  },
  {
    id: '4', type: 'order', icon: '✅',
    title: 'Order #ORQ-0038 delivered',
    sub: 'Live Resin Cartridges · 500 units',
    time: '2d ago', color: '#4ADE80',
  },
  {
    id: '5', type: 'payment', icon: '💳',
    title: 'Invoice paid',
    sub: 'NM Extract Labs · $7,250.00',
    time: '3d ago', color: '#A78BFA',
  },
];

const QUICK_ACTIONS = [
  { label: 'Browse', icon: '🛍️', route: '/(tabs)/marketplace' },
  { label: 'New Order', icon: '📦', route: '/orders/create' },
  { label: 'Track', icon: '🚚', route: '/(tabs)/logistics' },
  { label: 'Profile', icon: '👤', route: '/(tabs)/profile' },
];

export default function DashboardScreen() {
  const { user } = useAuthStore();

  const initials = user?.businessName
    ? user.businessName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'OP';

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>

        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-4 mb-5">
          <View>
            <Text className="text-gray-400 text-sm">Good morning,</Text>
            <Text className="text-white text-xl font-bold">{user?.businessName ?? 'Operator'}</Text>
            <View className="flex-row items-center mt-0.5">
              <View className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" />
              <Text className="text-green-400 text-xs capitalize">{user?.operatorType ?? 'operator'} · Active</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile')}
            className="w-11 h-11 rounded-full bg-[#1E3A23] border-2 border-[#4ADE80]/40 items-center justify-center"
          >
            <Text className="text-[#4ADE80] font-bold">{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row px-5 gap-3 mb-5">
          {STATS.map((s) => (
            <View key={s.label} className="flex-1 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-3">
              <Text className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</Text>
              <Text className="text-white text-xs font-medium mb-0.5">{s.label}</Text>
              <Text className="text-gray-500 text-xs">{s.delta}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-5">
          <Text className="text-white font-semibold text-base mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity
                key={a.label}
                onPress={() => router.push(a.route as never)}
                className="flex-1 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl py-4 items-center"
                activeOpacity={0.7}
              >
                <Text className="text-2xl mb-1.5">{a.icon}</Text>
                <Text className="text-gray-300 text-xs font-medium">{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Market Pulse */}
        <View className="px-5 mb-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white font-semibold text-base">Market Pulse</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/marketplace' as never)}>
              <Text className="text-[#4ADE80] text-sm">See all →</Text>
            </TouchableOpacity>
          </View>
          <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-4">
            {[
              { label: 'Flower (indoor/lb)', price: '$1,150–$1,300', delta: '↑ 4%' },
              { label: 'Live Resin (per unit)', price: '$13–$16', delta: '→ stable' },
              { label: 'Pre-rolls (5pk)', price: '$24–$32', delta: '↑ 2%' },
            ].map((row, i, arr) => (
              <View key={row.label} className={`flex-row justify-between items-center py-2.5 ${i < arr.length - 1 ? 'border-b border-[#1E3A23]' : ''}`}>
                <Text className="text-gray-400 text-sm">{row.label}</Text>
                <View className="items-end">
                  <Text className="text-white text-sm font-medium">{row.price}</Text>
                  <Text className={`text-xs ${row.delta.includes('↑') ? 'text-green-400' : 'text-gray-500'}`}>{row.delta}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-5">
          <Text className="text-white font-semibold text-base mb-3">Recent Activity</Text>
          <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl overflow-hidden">
            {ACTIVITY.map((item, i) => (
              <TouchableOpacity
                key={item.id}
                className={`flex-row items-center px-4 py-3.5 ${i < ACTIVITY.length - 1 ? 'border-b border-[#1E3A23]' : ''}`}
                activeOpacity={0.6}
              >
                <View className="w-9 h-9 rounded-full items-center justify-center mr-3" style={{ backgroundColor: item.color + '18' }}>
                  <Text className="text-base">{item.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-medium mb-0.5">{item.title}</Text>
                  <Text className="text-gray-500 text-xs">{item.sub}</Text>
                </View>
                <Text className="text-gray-600 text-xs ml-2">{item.time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
