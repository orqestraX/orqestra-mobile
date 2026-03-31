import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuthStore();

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-orq-bg">
      <View className="flex-1 px-6 pt-16">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Text className="text-orq-green text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-white font-black text-3xl mb-2">Welcome back</Text>
        <Text className="text-gray-400 mb-10">Sign in to your Orqestra account</Text>

        <View className="mb-4">
          <Text className="text-gray-400 text-sm mb-2">Email Address</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@business.com"
            placeholderTextColor="#4B5563"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-orq-surface border border-gray-700 rounded-xl px-4 py-4 text-white text-base"
          />
        </View>

        <View className="mb-8">
          <Text className="text-gray-400 text-sm mb-2">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor="#4B5563"
            secureTextEntry
            className="bg-orq-surface border border-gray-700 rounded-xl px-4 py-4 text-white text-base"
          />
        </View>

        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className="bg-orq-green rounded-xl py-4 items-center mb-4"
        >
          <Text className="text-black font-bold text-base">{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
          <Text className="text-gray-400 text-center">
            Don't have an account? <Text className="text-orq-green font-semibold">Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}