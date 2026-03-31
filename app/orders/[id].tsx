import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

const ORDERS: Record<string, {
  id: string; product: string; vendor: string; qty: string; total: string;
  status: string; date: string; eta: string; step: number;
  unitPrice: string; delivery: string; license: string;
  steps: string[]; timestamps: string[];
}> = {
  'ORQ-0041': {
    id: 'ORQ-0041', product: 'Blue Dream — Indoor', vendor: 'High Desert Farms',
    qty: '10 lbs', total: '$12,000', unitPrice: '$1,200/lb',
    status: 'Active', date: 'Mar 29, 2026', eta: 'Apr 1, 2026',
    delivery: 'Express (1–2 days)', license: 'NM-CULT-00482', step: 2,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
    timestamps: ['Mar 29 · 10:14 AM', 'Mar 29 · 2:30 PM', 'Apr 1 · 9:14 AM', ''],
  },
  'ORQ-0040': {
    id: 'ORQ-0040', product: 'Infused Pre-rolls 5pk', vendor: 'Duke City Cannabis',
    qty: '200 packs', total: '$5,600', unitPrice: '$28/pack',
    status: 'Active', date: 'Mar 28, 2026', eta: 'Apr 2, 2026',
    delivery: 'Standard (3–5 days)', license: 'NM-MFG-00887', step: 1,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
    timestamps: ['Mar 28 · 4:02 PM', 'Mar 29 · 9:00 AM', '', ''],
  },
  'ORQ-0039': {
    id: 'ORQ-0039', product: 'Live Resin Cartridge', vendor: 'NM Extract Labs',
    qty: '500 units', total: '$7,250', unitPrice: '$14.50/unit',
    status: 'Pending', date: 'Mar 30, 2026', eta: 'Awaiting confirmation',
    delivery: 'Standard (3–5 days)', license: 'NM-MFG-00751', step: 0,
    steps: ['Order placed', 'Vendor confirmed', 'In transit', 'Delivered'],
    timestamps: ['Mar 30 · 11:45 AM', '', '', ''],
  },
};

const STATUS_COLORS: Record<string, string> = {
  Active: '#4ADE80', Pending: '#FACC15', Completed: '#60A5FA',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-[#1E3A23]">
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-sm font-medium">{value}</Text>
    </View>
  );
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = ORDERS[id ?? ''];

  if (!order) return (
    <SafeAreaView className="flex-1 bg-[#070D09] items-center justify-center">
      <Text className="text-white">Order not found</Text>
    </SafeAreaView>
  );

  const color = STATUS_COLORS[order.status] ?? '#4ADE80';

  const handleCancel = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order? This action cannot be undone.', [
      { text: 'Keep Order', style: 'cancel' },
      { text: 'Cancel Order', style: 'destructive', onPress: () => router.replace('/(tabs)/orders') },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <View className="flex-row items-center px-5 pt-2 pb-4 border-b border-[#1E3A23]">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-[#4ADE80] text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-white font-bold text-lg flex-1">Order #{order.id}</Text>
        <View className="rounded-full px-3 py-1" style={{ backgroundColor: color + '22' }}>
          <Text className="text-xs font-semibold" style={{ color }}>{order.status}</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Progress */}
        <View className="px-5 pt-5 mb-5">
          <View className="flex-row gap-1 mb-3">
            {order.steps.map((_, i) => (
              <View key={i} className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: i <= order.step ? color : '#1E3A23' }} />
            ))}
          </View>
          <View className="flex-row justify-between">
            {order.steps.map((label, i) => (
              <Text key={i} className={['text-xs', i <= order.step ? 'text-white' : 'text-gray-600'].join(' ')} style={{ width: '22%', textAlign: 'center' }} numberOfLines={1}>
                {label}
              </Text>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View className="mx-5 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl px-4 mb-5">
          <Text className="text-white font-semibold pt-4 mb-1">Order Summary</Text>
          <Row label="Product" value={order.product} />
          <Row label="Vendor" value={order.vendor} />
          <Row label="Quantity" value={order.qty} />
          <Row label="Unit Price" value={order.unitPrice} />
          <Row label="Delivery" value={order.delivery} />
          <Row label="Order Date" value={order.date} />
          <Row label="ETA" value={order.eta} />
          <View className="flex-row justify-between py-3">
            <Text className="text-white font-bold">Total</Text>
            <Text className="text-[#4ADE80] font-bold text-base">{order.total}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View className="mx-5 mb-5">
          <Text className="text-white font-semibold text-base mb-4">Order Timeline</Text>
          {order.steps.map((label, i) => {
            const done = i <= order.step;
            const isLast = i === order.steps.length - 1;
            return (
              <View key={i} className="flex-row">
                <View className="items-center mr-3" style={{ width: 24 }}>
                  <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${done ? 'bg-[#4ADE80] border-[#4ADE80]' : 'bg-transparent border-[#374151]'}`}>
                    {done && <Text className="text-[#070D09] text-xs font-bold">✓</Text>}
                  </View>
                  {!isLast && <View className="flex-1 w-px bg-[#1E3A23] mt-1" style={{ minHeight: 28 }} />}
                </View>
                <View className="flex-1 pb-5">
                  <Text className={['text-sm font-medium mb-0.5', done ? 'text-white' : 'text-gray-500'].join(' ')}>{label}</Text>
                  {order.timestamps[i] ? (
                    <Text className="text-gray-600 text-xs">{order.timestamps[i]}</Text>
                  ) : (
                    <Text className="text-gray-700 text-xs">Pending</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Compliance */}
        <View className="mx-5 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl px-4 mb-5">
          <Text className="text-white font-semibold pt-4 mb-1">Compliance</Text>
          <Row label="Vendor License" value={order.license} />
          <Row label="State Verified" value="✓ New Mexico CCD" />
          <View className="py-3">
            <Text className="text-gray-400 text-sm">Manifest #</Text>
            <Text className="text-gray-600 text-xs mt-0.5">{order.status === 'Active' || order.step >= 2 ? 'MFT-' + order.id.replace('ORQ-', '') + '-2026' : 'Generated at pickup'}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      {order.status !== 'Completed' && (
        <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-3 bg-[#070D09] border-t border-[#1E3A23] flex-row gap-3">
          <TouchableOpacity onPress={() => router.push('/(tabs)/logistics' as never)} className="flex-1 border border-[#1E3A23] rounded-2xl py-3.5 items-center" activeOpacity={0.7}>
            <Text className="text-gray-300 font-semibold text-sm">Track Shipment</Text>
          </TouchableOpacity>
          {order.status === 'Pending' && (
            <TouchableOpacity onPress={handleCancel} className="flex-1 bg-red-900/30 border border-red-900/50 rounded-2xl py-3.5 items-center" activeOpacity={0.7}>
              <Text className="text-red-400 font-semibold text-sm">Cancel Order</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
