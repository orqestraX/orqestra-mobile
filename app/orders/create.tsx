import {
  ScrollView, View, Text, TouchableOpacity,
  TextInput, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

const PRODUCTS = [
  { id: '1', name: 'Blue Dream — Indoor', vendor: 'High Desert Farms', price: 1200, unit: 'lb' },
  { id: '2', name: 'OG Kush — Greenhouse', vendor: 'Sandia Cultivators', price: 950, unit: 'lb' },
  { id: '3', name: 'Live Resin Cartridge', vendor: 'NM Extract Labs', price: 14.50, unit: 'unit' },
  { id: '4', name: 'Distillate — Full Spectrum', vendor: 'Rio Grande Extracts', price: 8.00, unit: 'g' },
  { id: '5', name: 'Infused Pre-rolls 5pk', vendor: 'Duke City Cannabis', price: 28.00, unit: 'pack' },
  { id: '6', name: 'THC Gummies 100mg', vendor: 'Tierra Edibles', price: 4.50, unit: 'unit' },
];

const DELIVERY_OPTIONS = ['Standard (3–5 days)', 'Express (1–2 days)', 'Scheduled Pickup'];

export default function CreateOrderScreen() {
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [quantity, setQuantity] = useState('');
  const [delivery, setDelivery] = useState('Standard (3–5 days)');
  const [notes, setNotes] = useState('');

  const total = selectedProduct && quantity
    ? (selectedProduct.price * parseFloat(quantity || '0')).toFixed(2)
    : '0.00';

  const handleSubmit = () => {
    Alert.alert(
      'Order Submitted',
      'Your order has been placed and is pending vendor confirmation.',
      [{ text: 'View Orders', onPress: () => router.replace('/(tabs)/orders') }]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pt-2 pb-4 border-b border-[#1E3A23]">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-[#4ADE80] text-lg">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg flex-1">New Order</Text>
          <Text className="text-gray-500 text-sm">Step {step} of 2</Text>
        </View>

        {/* Step Indicator */}
        <View className="flex-row px-5 pt-4 gap-2 mb-5">
          {[1, 2].map(s => (
            <View
              key={s}
              className={`flex-1 h-1 rounded-full ${s <= step ? 'bg-[#4ADE80]' : 'bg-[#1E3A23]'}`}
            />
          ))}
        </View>

        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">

          {step === 1 && (
            <>
              <Text className="text-white font-semibold text-base mb-3">Select Product</Text>
              {PRODUCTS.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedProduct(p)}
                  className={`flex-row items-center p-4 rounded-2xl border mb-2 ${
                    selectedProduct?.id === p.id
                      ? 'bg-[#1E3A23] border-[#4ADE80]'
                      : 'bg-[#0F1A12] border-[#1E3A23]'
                  }`}
                  activeOpacity={0.7}
                >
                  <View className="flex-1">
                    <Text className="text-white font-medium mb-0.5">{p.name}</Text>
                    <Text className="text-gray-400 text-xs">{p.vendor}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[#4ADE80] font-bold">${p.price.toFixed(2)}</Text>
                    <Text className="text-gray-500 text-xs">per {p.unit}</Text>
                  </View>
                  {selectedProduct?.id === p.id && (
                    <Text className="text-[#4ADE80] ml-3 text-lg">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 2 && selectedProduct && (
            <>
              {/* Selected Product Summary */}
              <View className="bg-[#0F1A12] border border-[#4ADE80]/30 rounded-2xl p-4 mb-5">
                <Text className="text-gray-400 text-xs mb-1">Selected Product</Text>
                <Text className="text-white font-semibold">{selectedProduct.name}</Text>
                <Text className="text-gray-400 text-sm">{selectedProduct.vendor}</Text>
              </View>

              {/* Quantity */}
              <Text className="text-white font-semibold text-sm mb-2">Quantity ({selectedProduct.unit}s)</Text>
              <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-xl px-4 py-3 mb-4">
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder={`Enter quantity in ${selectedProduct.unit}s...`}
                  placeholderTextColor="#4B5563"
                  keyboardType="numeric"
                  className="text-white text-sm"
                />
              </View>

              {/* Delivery */}
              <Text className="text-white font-semibold text-sm mb-2">Delivery Method</Text>
              <View className="mb-4">
                {DELIVERY_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setDelivery(opt)}
                    className={`flex-row items-center p-3.5 rounded-xl border mb-2 ${
                      delivery === opt ? 'bg-[#1E3A23] border-[#4ADE80]' : 'bg-[#0F1A12] border-[#1E3A23]'
                    }`}
                    activeOpacity={0.7}
                  >
                    <View className={`w-4 h-4 rounded-full border mr-3 items-center justify-center ${
                      delivery === opt ? 'border-[#4ADE80]' : 'border-[#374151]'
                    }`}>
                      {delivery === opt && <View className="w-2 h-2 rounded-full bg-[#4ADE80]" />}
                    </View>
                    <Text className={`text-sm ${delivery === opt ? 'text-white' : 'text-gray-400'}`}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notes */}
              <Text className="text-white font-semibold text-sm mb-2">Notes (optional)</Text>
              <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-xl px-4 py-3 mb-5">
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Special instructions, packaging preferences..."
                  placeholderTextColor="#4B5563"
                  multiline
                  numberOfLines={3}
                  className="text-white text-sm"
                  style={{ minHeight: 70 }}
                />
              </View>

              {/* Order Summary */}
              <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-4 mb-6">
                <Text className="text-white font-semibold mb-3">Order Summary</Text>
                {[
                  ['Product', selectedProduct.name],
                  ['Quantity', quantity ? `${quantity} ${selectedProduct.unit}s` : '—'],
                  ['Unit Price', `$${selectedProduct.price.toFixed(2)}`],
                  ['Delivery', delivery],
                ].map(([label, value]) => (
                  <View key={label} className="flex-row justify-between py-2 border-b border-[#1E3A23]">
                    <Text className="text-gray-400 text-sm">{label}</Text>
                    <Text className="text-white text-sm font-medium" numberOfLines={1} style={{ maxWidth: '55%', textAlign: 'right' }}>{value}</Text>
                  </View>
                ))}
                <View className="flex-row justify-between pt-3">
                  <Text className="text-white font-bold">Estimated Total</Text>
                  <Text className="text-[#4ADE80] font-bold text-base">${parseFloat(total).toLocaleString()}</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Footer CTA */}
        <View className="px-5 pb-8 pt-3 border-t border-[#1E3A23]">
          {step === 1 ? (
            <TouchableOpacity
              onPress={() => selectedProduct && setStep(2)}
              className={`rounded-2xl py-4 items-center ${selectedProduct ? 'bg-[#4ADE80]' : 'bg-[#1E3A23]'}`}
              activeOpacity={0.8}
            >
              <Text className={`font-bold text-base ${selectedProduct ? 'text-[#070D09]' : 'text-gray-500'}`}>
                Continue →
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setStep(1)}
                className="flex-1 border border-[#1E3A23] rounded-2xl py-4 items-center"
                activeOpacity={0.7}
              >
                <Text className="text-gray-300 font-semibold">Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => quantity ? handleSubmit() : null}
                className={`flex-2 rounded-2xl py-4 items-center px-8 ${quantity ? 'bg-[#4ADE80]' : 'bg-[#1E3A23]'}`}
                activeOpacity={0.8}
              >
                <Text className={`font-bold ${quantity ? 'text-[#070D09]' : 'text-gray-500'}`}>Place Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
