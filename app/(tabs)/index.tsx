import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/authStore';

const stats = [
  { label: 'Active Orders', value: '0', color: '#4ADE80' },
  { label: 'Pending', value: '0', color: '#FACC15' },
  { label: 'Completed', value: '0', color: '#60A5FA' },
];

const quickActions = [
  { label: 'Browse Marketplace', icon: '🛍️', route: 'marketplace' },
  { label: 'New Order', icon: '📦', route: 'orders' },
  { label: 'Track Shipment', icon: '🚚', route: 'logistics' },
  { label: 'View Profile', icon: '👤', route: 'profile' },
];

export default function DashboardScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-gray-400 text-sm font-medium mb-1">Welcome back</Text>
          <Text className="text-white text-2xl font-bold">
            {user?.businessName ?? 'Operator'}
          </Text>
          <View className="mt-1 flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
            <Text className="text-green-400 text-xs capitalize">{user?.operatorType ?? 'operator'}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View className="flex-row gap-3 mb-6">
          {stats.map((s) => (
            <View key={s.label} className="flex-1 bg-[#0F1A12] rounded-2xl p-4 border border-[#1E3A23]">
              <Text className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</Text>
              <Text className="text-gray-400 text-xs">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text className="text-white text-lg font-semibold mb-3">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {quickActions.map((a) => (
            <TouchableOpacity
              key={a.label}
              className="w-[47%] bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-4"
              activeOpacity={0.7}
            >
              <Text className="text-2xl mb-2">{a.icon}</Text>
              <Text className="text-white text-sm font-medium">{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity Placeholder */}
        <Text className="text-white text-lg font-semibold mb-3">Recent Activity</Text>
        <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-6 items-center">
          <Text className="text-4xl mb-3">📋</Text>
          <Text className="text-white font-semibold mb-1">No activity yet</Text>
          <Text className="text-gray-400 text-sm text-center">
            Your orders and transactions will appear here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
