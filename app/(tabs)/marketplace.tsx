import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const categories = ['All', 'Flower', 'Concentrates', 'Edibles', 'Pre-rolls', 'Trim'];

export default function MarketplaceScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-4 mb-4">
          <Text className="text-white text-2xl font-bold mb-1">Marketplace</Text>
          <Text className="text-gray-400 text-sm">Browse cannabis products & services</Text>
        </View>

        {/* Search */}
        <View className="px-5 mb-4">
          <View className="flex-row items-center bg-[#0F1A12] border border-[#1E3A23] rounded-xl px-4 py-3">
            <Text className="text-gray-500 mr-2">🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search products..."
              placeholderTextColor="#6B7280"
              className="flex-1 text-white text-sm"
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5 pl-5">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`mr-2 px-4 py-2 rounded-full border ${
                activeCategory === cat
                  ? 'bg-[#4ADE80] border-[#4ADE80]'
                  : 'bg-transparent border-[#1E3A23]'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-medium ${activeCategory === cat ? 'text-[#070D09]' : 'text-gray-400'}`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Empty State */}
        <View className="px-5 mt-10 items-center">
          <Text className="text-5xl mb-4">🌿</Text>
          <Text className="text-white text-lg font-semibold mb-2">Marketplace Coming Soon</Text>
          <Text className="text-gray-400 text-sm text-center">
            Verified operators will be able to list and purchase products here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
