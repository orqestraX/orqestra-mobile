import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const statuses = [
  { icon: '📋', label: 'Scheduled', count: 0, color: '#60A5FA' },
  { icon: '🚚', label: 'In Transit', count: 0, color: '#FACC15' },
  { icon: '✅', label: 'Delivered', count: 0, color: '#4ADE80' },
];

export default function LogisticsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-4 mb-5">
          <Text className="text-white text-2xl font-bold mb-1">Logistics</Text>
          <Text className="text-gray-400 text-sm">Track your shipments & deliveries</Text>
        </View>

        {/* Status Cards */}
        <View className="flex-row px-5 gap-3 mb-6">
          {statuses.map((s) => (
            <View key={s.label} className="flex-1 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-4 items-center">
              <Text className="text-2xl mb-1">{s.icon}</Text>
              <Text className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.count}</Text>
              <Text className="text-gray-400 text-xs text-center">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Map Placeholder */}
        <View className="mx-5 mb-5 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl overflow-hidden" style={{ height: 180 }}>
          <View className="flex-1 items-center justify-center">
            <Text className="text-4xl mb-2">🗺️</Text>
            <Text className="text-gray-400 text-sm">Live tracking map</Text>
            <Text className="text-gray-600 text-xs mt-1">Available with active shipments</Text>
          </View>
        </View>

        {/* Shipments Empty State */}
        <View className="px-5">
          <Text className="text-white text-lg font-semibold mb-3">Active Shipments</Text>
          <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-6 items-center">
            <Text className="text-4xl mb-3">🚚</Text>
            <Text className="text-white font-semibold mb-1">No active shipments</Text>
            <Text className="text-gray-400 text-sm text-center">
              Shipments booked through Orqestra will be tracked here in real time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
