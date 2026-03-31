import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/src/store/authStore';
import { router } from 'expo-router';

const menuItems = [
  { icon: '🏢', label: 'Business Profile', sub: 'License, contact, details', route: null },
  { icon: '🔔', label: 'Notifications', sub: 'Order alerts, updates', route: '/notifications' },
  { icon: '🔒', label: 'Security', sub: 'Password, 2FA', route: null },
  { icon: '📄', label: 'Compliance Documents', sub: 'Licenses & permits', route: null },
  { icon: '💳', label: 'Billing', sub: 'Subscription & invoices', route: null },
  { icon: '❓', label: 'Help & Support', sub: 'Chat with Orq AI · 24/7', route: '/help' },
];

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/welcome');
  };

  const initials = user?.businessName
    ? user.businessName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'OP';

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-4 mb-6">
          <Text className="text-white text-2xl font-bold">Profile</Text>
        </View>

        {/* Avatar + Business Info */}
        <View className="px-5 mb-6 flex-row items-center">
          <View className="w-16 h-16 rounded-full bg-[#1E3A23] border-2 border-[#4ADE80] items-center justify-center mr-4">
            <Text className="text-[#4ADE80] text-xl font-bold">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">{user?.businessName ?? 'Your Business'}</Text>
            <Text className="text-gray-400 text-sm capitalize">{user?.operatorType ?? 'operator'}</Text>
            {user?.licenseNumber && (
              <Text className="text-gray-500 text-xs mt-0.5">License: {user.licenseNumber}</Text>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-5 mb-6">
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => item.route && router.push(item.route as never)}
              className={`flex-row items-center py-4 ${idx < menuItems.length - 1 ? 'border-b border-[#1E3A23]' : ''}`}
              activeOpacity={0.6}
            >
              <Text className="text-2xl w-8">{item.icon}</Text>
              <View className="flex-1 ml-3">
                <Text className="text-white text-sm font-medium">{item.label}</Text>
                <Text className="text-gray-500 text-xs">{item.sub}</Text>
              </View>
              <Text className="text-gray-600">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <View className="px-5 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-[#1A0A0A] border border-[#3A1E1E] rounded-xl py-4 items-center"
            activeOpacity={0.7}
          >
            <Text className="text-red-400 font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
