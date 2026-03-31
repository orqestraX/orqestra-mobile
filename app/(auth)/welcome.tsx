import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-orq-bg">
      <LinearGradient
        colors={['#16532D33', '#070D09', '#070D09']}
        className="flex-1 items-center justify-center px-8"
      >
        {/* Logo */}
        <View className="w-20 h-20 rounded-2xl bg-orq-green items-center justify-center mb-6">
          <Text className="text-black font-black text-3xl">O</Text>
        </View>
        <Text className="text-white font-black text-4xl mb-2">Orqestra</Text>
        <View className="bg-emerald-950 border border-emerald-800 rounded-full px-3 py-1 mb-10">
          <Text className="text-emerald-400 text-xs font-semibold">NM Beta</Text>
        </View>

        <Text className="text-white font-black text-3xl text-center mb-4 leading-tight">
          The Marketplace{'
'}
          <Text className="text-orq-green">for Cannabis Operators</Text>
        </Text>
        <Text className="text-gray-400 text-base text-center mb-12 leading-relaxed">
          Connect with cultivators, manufacturers, dispensaries, and couriers across New Mexico.
        </Text>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/sign-up')}
          className="w-full bg-orq-green rounded-xl py-4 items-center mb-4"
        >
          <Text className="text-black font-bold text-base">Get Started Free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/sign-in')}
          className="w-full border border-gray-700 rounded-xl py-4 items-center"
        >
          <Text className="text-white font-semibold text-base">Sign In</Text>
        </TouchableOpacity>

        <Text className="text-gray-600 text-xs text-center mt-8">
          NM Licensed Operators Only  •  METRC-Compatible
        </Text>
      </LinearGradient>
    </View>
  );
}