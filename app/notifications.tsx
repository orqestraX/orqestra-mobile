import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

const NOTIFICATIONS = [
  {
    id: '1', read: false, icon: '🚚', color: '#FACC15',
    title: 'Shipment SHP-0022 is on the way',
    body: 'Blue Dream — Indoor is in transit. Estimated arrival Apr 1 at 2:30 PM.',
    time: '2h ago', action: 'Track shipment',
  },
  {
    id: '2', read: false, icon: '✅', color: '#4ADE80',
    title: 'Order ORQ-0041 confirmed',
    body: 'High Desert Farms accepted your order for 10 lbs Blue Dream at $12,000.',
    time: '3h ago', action: 'View order',
  },
  {
    id: '3', read: false, icon: '🌿', color: '#60A5FA',
    title: 'New listing: OG Kush — 120 lbs',
    body: 'Sandia Cultivators just listed 120 lbs of OG Kush at $950/lb. Bulk pricing available.',
    time: '5h ago', action: 'View listing',
  },
  {
    id: '4', read: true, icon: '📦', color: '#A78BFA',
    title: 'Order ORQ-0039 received',
    body: 'Your order for 500 Live Resin Cartridges from NM Extract Labs is pending vendor confirmation.',
    time: '1d ago', action: null,
  },
  {
    id: '5', read: true, icon: '💳', color: '#4ADE80',
    title: 'Invoice paid — $7,250',
    body: 'Payment processed for Order ORQ-0038 with NM Extract Labs. Receipt available.',
    time: '2d ago', action: 'View receipt',
  },
  {
    id: '6', read: true, icon: '✅', color: '#4ADE80',
    title: 'Order ORQ-0037 delivered',
    body: '20 lbs OG Kush from Sandia Cultivators delivered and signed off. Rate your experience.',
    time: '3d ago', action: 'Leave review',
  },
  {
    id: '7', read: true, icon: '🔔', color: '#60A5FA',
    title: 'Price alert: Flower prices up 4%',
    body: 'Indoor flower in New Mexico is averaging $1,150–$1,300/lb this week, up from last week.',
    time: '4d ago', action: null,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <View className="flex-row items-center justify-between px-5 pt-4 mb-4">
        <View>
          <Text className="text-white text-2xl font-bold">Notifications</Text>
          {unread > 0 && (
            <Text className="text-gray-400 text-sm">{unread} unread</Text>
          )}
        </View>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}>
            <Text className="text-[#4ADE80] text-sm">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {notifications.map((n, i) => (
          <TouchableOpacity
            key={n.id}
            onPress={() => markRead(n.id)}
            activeOpacity={0.7}
            className={['flex-row px-5 py-4', i < notifications.length - 1 ? 'border-b border-[#0F1A12]' : '', !n.read ? 'bg-[#0F1A12]/60' : ''].join(' ')}
          >
            {/* Unread dot */}
            <View className="mr-1 pt-1.5" style={{ width: 8 }}>
              {!n.read && <View className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />}
            </View>

            {/* Icon */}
            <View className="w-10 h-10 rounded-full items-center justify-center mr-3 flex-shrink-0" style={{ backgroundColor: n.color + '18' }}>
              <Text className="text-lg">{n.icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1">
              <Text className={['text-sm font-semibold mb-0.5', n.read ? 'text-gray-300' : 'text-white'].join(' ')}>{n.title}</Text>
              <Text className="text-gray-500 text-xs leading-4 mb-2">{n.body}</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 text-xs">{n.time}</Text>
                {n.action && (
                  <Text className="text-[#4ADE80] text-xs font-medium">{n.action} →</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
