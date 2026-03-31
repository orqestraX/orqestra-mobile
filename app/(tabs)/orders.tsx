import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

const TABS = ['Active', 'Pending', 'Completed'];

const ORDERS = [
  {
    id: 'ORQ-0041', product: 'Blue Dream — Indoor', vendor: 'High Desert Farms',
    qty: '10 lbs', total: '$12,000', status: 'Active', date: 'Mar 29, 2026',
    eta: 'Apr 1, 2026', step: 2,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
  },
  {
    id: 'ORQ-0040', product: 'Infused Pre-rolls 5pk', vendor: 'Duke City Cannabis',
    qty: '200 packs', total: '$5,600', status: 'Active', date: 'Mar 28, 2026',
    eta: 'Apr 2, 2026', step: 1,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
  },
  {
    id: 'ORQ-0039', product: 'Live Resin Cartridge', vendor: 'NM Extract Labs',
    qty: '500 units', total: '$7,250', status: 'Pending', date: 'Mar 30, 2026',
    eta: 'Awaiting confirmation', step: 0,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
  },
  {
    id: 'ORQ-0038', product: 'Distillate — Full Spectrum', vendor: 'Rio Grande Extracts',
    qty: '300 g', total: '$2,400', status: 'Pending', date: 'Mar 30, 2026',
    eta: 'Awaiting confirmation', step: 0,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
  },
  {
    id: 'ORQ-0037', product: 'OG Kush — Greenhouse', vendor: 'Sandia Cultivators',
    qty: '20 lbs', total: '$19,000', status: 'Completed', date: 'Mar 20, 2026',
    eta: 'Delivered Mar 24', step: 3,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
  },
  {
    id: 'ORQ-0036', product: 'THC Gummies 100mg', vendor: 'Tierra Edibles',
    qty: '500 units', total: '$2,250', status: 'Completed', date: 'Mar 15, 2026',
    eta: 'Delivered Mar 19', step: 3,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
  },
];

const STATUS_COLORS: Record<string, string> = {
  Active: '#4ADE80', Pending: '#FACC15', Completed: '#60A5FA',
};

function OrderCard({ order, onPress }: { order: typeof ORDERS[0]; onPress: () => void }) {
  const color = STATUS_COLORS[order.status];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-4 mb-3"
    >
      {/* Top row */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-white font-semibold mb-0.5">{order.product}</Text>
          <Text className="text-gray-400 text-xs">{order.vendor}</Text>
        </View>
        <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: color + '22' }}>
          <Text className="text-xs font-semibold" style={{ color }}>{order.status}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="flex-row gap-1 mb-3">
        {order.steps.map((_, i) => (
          <View
            key={i}
            className="flex-1 h-1 rounded-full"
            style={{ backgroundColor: i <= order.step ? color : '#1E3A23' }}
          />
        ))}
      </View>
      <Text className="text-gray-500 text-xs mb-3">
        {order.steps[order.step]} · {order.eta}
      </Text>

      {/* Bottom row */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-4">
          <View>
            <Text className="text-gray-500 text-xs mb-0.5">Order ID</Text>
            <Text className="text-white text-sm font-medium">#{order.id}</Text>
          </View>
          <View>
            <Text className="text-gray-500 text-xs mb-0.5">Qty</Text>
            <Text className="text-white text-sm font-medium">{order.qty}</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-gray-500 text-xs mb-0.5">Total</Text>
          <Text className="text-[#4ADE80] font-bold">{order.total}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState('Active');

  const filtered = ORDERS.filter(o => o.status === activeTab);
  const counts = Object.fromEntries(TABS.map(t => [t, ORDERS.filter(o => o.status === t).length]));

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <View className="px-5 pt-4 mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-2xl font-bold">Orders</Text>
          <Text className="text-gray-400 text-sm">{ORDERS.length} total orders</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/orders/create')}
          className="bg-[#4ADE80] px-4 py-2 rounded-xl"
          activeOpacity={0.8}
        >
          <Text className="text-[#070D09] font-bold text-sm">+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row px-5 mb-4 gap-2">
        {TABS.map(t => (
          <TouchableOpacity
            key={t}
            onPress={() => setActiveTab(t)}
            className={`flex-row items-center px-4 py-2 rounded-full border ${
              activeTab === t ? 'bg-[#4ADE80] border-[#4ADE80]' : 'bg-transparent border-[#1E3A23]'
            }`}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-medium mr-1.5 ${activeTab === t ? 'text-[#070D09]' : 'text-gray-400'}`}>{t}</Text>
            <View className={`rounded-full px-1.5 py-0.5 ${activeTab === t ? 'bg-[#070D09]/20' : 'bg-[#1E3A23]'}`}>
              <Text className={`text-xs font-bold ${activeTab === t ? 'text-[#070D09]' : 'text-gray-500'}`}>{counts[t]}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-5">
        {filtered.length === 0 ? (
          <View className="mt-16 items-center">
            <Text className="text-4xl mb-3">📦</Text>
            <Text className="text-white font-semibold mb-1">No {activeTab.toLowerCase()} orders</Text>
            <Text className="text-gray-400 text-sm text-center mb-6">Orders placed through the marketplace will appear here.</Text>
            <TouchableOpacity onPress={() => router.push('/orders/create')} className="bg-[#4ADE80] px-6 py-3 rounded-xl" activeOpacity={0.8}>
              <Text className="text-[#070D09] font-semibold">Place First Order</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => router.push(`/orders/${order.id}`)}
            />
          ))
        )}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
