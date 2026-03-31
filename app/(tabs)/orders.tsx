import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const tabs = ['Active', 'Pending', 'Completed'];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('Active');

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      {/* Header */}
      <View className="px-5 pt-4 mb-4">
        <Text className="text-white text-2xl font-bold mb-1">Orders</Text>
        <Text className="text-gray-400 text-sm">Track and manage your orders</Text>
      </View>

      {/* Tab Pills */}
      <View className="flex-row px-5 mb-5 gap-2">
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setActiveTab(t)}
            className={`px-5 py-2 rounded-full border ${
              activeTab === t
                ? 'bg-[#4ADE80] border-[#4ADE80]'
                : 'bg-transparent border-[#1E3A23]'
            }`}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-medium ${activeTab === t ? 'text-[#070D09]' : 'text-gray-400'}`}>
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-5">
        {/* Empty State */}
        <View className="mt-16 items-center">
          <Text className="text-5xl mb-4">📦</Text>
          <Text className="text-white text-lg font-semibold mb-2">No {activeTab.toLowerCase()} orders</Text>
          <Text className="text-gray-400 text-sm text-center">
            Orders placed through the marketplace will appear here.
          </Text>
          <TouchableOpacity
            className="mt-6 bg-[#4ADE80] px-6 py-3 rounded-xl"
            activeOpacity={0.8}
          >
            <Text className="text-[#070D09] font-semibold">Browse Marketplace</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
