import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const SHIPMENTS = [
  {
    id: 'SHP-0022',
    orderId: 'ORQ-0041',
    product: 'Blue Dream — Indoor',
    from: 'High Desert Farms, Albuquerque',
    to: 'Your Facility, Santa Fe',
    status: 'In Transit',
    statusColor: '#FACC15',
    driver: 'Carlos M.',
    vehicle: 'White Ford Transit · NM-4829',
    eta: 'Apr 1 · Est. 2:30 PM',
    distance: '64 mi remaining',
    events: [
      { time: 'Today 9:14 AM', label: 'Departed origin', done: true },
      { time: 'Today 11:02 AM', label: 'Checkpoint passed — I-25 N', done: true },
      { time: 'Today 2:30 PM', label: 'Estimated arrival', done: false },
    ],
  },
  {
    id: 'SHP-0021',
    orderId: 'ORQ-0040',
    product: 'Infused Pre-rolls 5pk',
    from: 'Duke City Cannabis, Albuquerque',
    to: 'Your Facility, Santa Fe',
    status: 'Scheduled',
    statusColor: '#60A5FA',
    driver: 'Pending assignment',
    vehicle: '—',
    eta: 'Apr 2 · Morning window',
    distance: '64 mi',
    events: [
      { time: 'Mar 28 3:00 PM', label: 'Order confirmed', done: true },
      { time: 'Apr 1 5:00 PM', label: 'Driver assigned', done: false },
      { time: 'Apr 2 8–11 AM', label: 'Pickup window', done: false },
      { time: 'Apr 2 Afternoon', label: 'Delivery window', done: false },
    ],
  },
];

const SUMMARY = [
  { icon: '📋', label: 'Scheduled', count: 1, color: '#60A5FA' },
  { icon: '🚚', label: 'In Transit', count: 1, color: '#FACC15' },
  { icon: '✅', label: 'Delivered', count: 5, color: '#4ADE80' },
];

function TimelineEvent({ time, label, done, isLast }: { time: string; label: string; done: boolean; isLast: boolean }) {
  return (
    <View className="flex-row">
      <View className="items-center mr-3" style={{ width: 20 }}>
        <View className={`w-4 h-4 rounded-full border-2 items-center justify-center ${done ? 'border-[#4ADE80] bg-[#4ADE80]' : 'border-[#374151] bg-transparent'}`}>
          {done && <Text className="text-[#070D09] text-xs font-bold">✓</Text>}
        </View>
        {!isLast && <View className="flex-1 w-px bg-[#1E3A23] mt-1" style={{ minHeight: 24 }} />}
      </View>
      <View className="flex-1 pb-4">
        <Text className={`text-sm font-medium mb-0.5 ${done ? 'text-white' : 'text-gray-500'}`}>{label}</Text>
        <Text className="text-gray-600 text-xs">{time}</Text>
      </View>
    </View>
  );
}

function ShipmentCard({ shipment, expanded, onToggle }: {
  shipment: typeof SHIPMENTS[0]; expanded: boolean; onToggle: () => void
}) {
  return (
    <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl mb-4 overflow-hidden">
      <TouchableOpacity onPress={onToggle} activeOpacity={0.75} className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-3">
            <Text className="text-white font-semibold mb-0.5">{shipment.product}</Text>
            <Text className="text-gray-500 text-xs">#{shipment.id} · Order #{shipment.orderId}</Text>
          </View>
          <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: shipment.statusColor + '22' }}>
            <Text className="text-xs font-semibold" style={{ color: shipment.statusColor }}>{shipment.status}</Text>
          </View>
        </View>

        {/* Route */}
        <View className="bg-[#070D09] rounded-xl p-3 mb-3">
          <View className="flex-row items-center mb-1.5">
            <View className="w-2 h-2 rounded-full bg-[#4ADE80] mr-2" />
            <Text className="text-gray-300 text-xs flex-1" numberOfLines={1}>{shipment.from}</Text>
          </View>
          <View className="w-px h-3 bg-[#1E3A23] ml-1 mb-1.5" />
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-[#FACC15] mr-2" />
            <Text className="text-gray-300 text-xs flex-1" numberOfLines={1}>{shipment.to}</Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          <View>
            <Text className="text-gray-500 text-xs mb-0.5">ETA</Text>
            <Text className="text-white text-sm font-medium">{shipment.eta}</Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-xs mb-0.5">{shipment.status === 'In Transit' ? 'Distance' : 'Route'}</Text>
            <Text className="text-white text-sm font-medium">{shipment.distance}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="px-4 pb-4 border-t border-[#1E3A23] pt-4">
          {/* Driver */}
          <View className="flex-row items-center mb-4 bg-[#070D09] rounded-xl p-3">
            <View className="w-9 h-9 rounded-full bg-[#1E3A23] items-center justify-center mr-3">
              <Text className="text-lg">🚗</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-medium">{shipment.driver}</Text>
              <Text className="text-gray-500 text-xs">{shipment.vehicle}</Text>
            </View>
            {shipment.status === 'In Transit' && (
              <TouchableOpacity className="bg-[#1E3A23] px-3 py-1.5 rounded-lg">
                <Text className="text-gray-300 text-xs">Contact</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Timeline */}
          <Text className="text-white font-semibold text-sm mb-3">Timeline</Text>
          {shipment.events.map((e, i) => (
            <TimelineEvent key={i} time={e.time} label={e.label} done={e.done} isLast={i === shipment.events.length - 1} />
          ))}
        </View>
      )}
    </View>
  );
}

export default function LogisticsScreen() {
  const [expanded, setExpanded] = useState<string | null>('SHP-0022');

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-5 pt-4 mb-5">
          <Text className="text-white text-2xl font-bold mb-1">Logistics</Text>
          <Text className="text-gray-400 text-sm">Track your shipments in real time</Text>
        </View>

        {/* Summary */}
        <View className="flex-row px-5 gap-3 mb-6">
          {SUMMARY.map(s => (
            <View key={s.label} className="flex-1 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-3 items-center">
              <Text className="text-xl mb-1">{s.icon}</Text>
              <Text className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.count}</Text>
              <Text className="text-gray-500 text-xs text-center">{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Active Shipments */}
        <View className="px-5">
          <Text className="text-white font-semibold text-base mb-3">Active Shipments</Text>
          {SHIPMENTS.map(s => (
            <ShipmentCard
              key={s.id}
              shipment={s}
              expanded={expanded === s.id}
              onToggle={() => setExpanded(expanded === s.id ? null : s.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
