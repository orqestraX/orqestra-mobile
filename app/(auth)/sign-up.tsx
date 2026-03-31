import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';

const OPERATOR_TYPES = [
  { id: 'cultivator', label: 'Cultivator', icon: '🌿', desc: 'Farms & Grows' },
  { id: 'manufacturer', label: 'Manufacturer', icon: '🏭', desc: 'Processors & Labs' },
  { id: 'dispensary', label: 'Dispensary', icon: '🏪', desc: 'Retail Operators' },
  { id: 'courier', label: 'Courier', icon: '🚚', desc: 'Transport & Delivery' },
];

export default function SignUpScreen() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-orq-bg">
      <ScrollView className="flex-1 px-6 pt-16" showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(step - 1)} className="mb-8">
          <Text className="text-orq-green text-base">← Back</Text>
        </TouchableOpacity>

        {/* Progress */}
        <View className="flex-row gap-2 mb-8">
          {[1, 2].map(s => (
            <View key={s} className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-orq-green' : 'bg-gray-700'}`} />
          ))}
        </View>

        {step === 1 && (
          <View>
            <Text className="text-white font-black text-3xl mb-2">Choose your role</Text>
            <Text className="text-gray-400 mb-8">Select your license type to get started.</Text>
            {OPERATOR_TYPES.map(op => (
              <TouchableOpacity
                key={op.id}
                onPress={() => setSelectedType(op.id)}
                className={`bg-orq-surface border rounded-xl p-4 mb-3 flex-row items-center ${selectedType === op.id ? 'border-orq-green' : 'border-gray-700'}`}
              >
                <Text className="text-2xl mr-4">{op.icon}</Text>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">{op.label}</Text>
                  <Text className="text-gray-400 text-sm">{op.desc}</Text>
                </View>
                {selectedType === op.id && <Text className="text-orq-green text-lg">✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => selectedType && setStep(2)}
              disabled={!selectedType}
              className={`rounded-xl py-4 items-center mt-4 mb-12 ${selectedType ? 'bg-orq-green' : 'bg-gray-700'}`}
            >
              <Text className={`font-bold text-base ${selectedType ? 'text-black' : 'text-gray-500'}`}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text className="text-white font-black text-3xl mb-2">Your business</Text>
            <Text className="text-gray-400 mb-8">Enter your business details and NM license number.</Text>
            {[
              { label: 'Business Name', value: businessName, set: setBusinessName, placeholder: 'Mesa Verde Farms LLC' },
              { label: 'Email Address', value: email, set: setEmail, placeholder: 'you@business.com' },
              { label: 'NM License Number', value: licenseNumber, set: setLicenseNumber, placeholder: 'CCD-NM-XXXXX' },
            ].map(field => (
              <View key={field.label} className="mb-4">
                <Text className="text-gray-400 text-sm mb-2">{field.label}</Text>
                <TextInput
                  value={field.value}
                  onChangeText={field.set}
                  placeholder={field.placeholder}
                  placeholderTextColor="#4B5563"
                  autoCapitalize="none"
                  className="bg-orq-surface border border-gray-700 rounded-xl px-4 py-4 text-white text-base"
                />
              </View>
            ))}
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="bg-orq-green rounded-xl py-4 items-center mt-4 mb-12"
            >
              <Text className="text-black font-bold text-base">Create Account</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}