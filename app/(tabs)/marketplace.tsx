import {
  ScrollView, View, Text, TouchableOpacity,
  TextInput, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';

const CATEGORIES = ['All', 'Flower', 'Concentrates', 'Edibles', 'Pre-rolls'];

const LISTINGS = [
  {
    id: '1',
    name: 'Blue Dream — Indoor',
    vendor: 'High Desert Farms',
    type: 'Flower',
    price: '$1,200',
    unit: 'per lb',
    thc: '24%',
    cbd: '0.1%',
    stock: '48 lbs',
    badge: 'Available',
    badgeColor: '#4ADE80',
    location: 'Albuquerque, NM',
  },
  {
    id: '2',
    name: 'OG Kush — Greenhouse',
    vendor: 'Sandia Cultivators',
    type: 'Flower',
    price: '$950',
    unit: 'per lb',
    thc: '21%',
    cbd: '0.2%',
    stock: '120 lbs',
    badge: 'Bulk Deal',
    badgeColor: '#FACC15',
    location: 'Santa Fe, NM',
  },
  {
    id: '3',
    name: 'Live Resin Cartridge',
    vendor: 'NM Extract Labs',
    type: 'Concentrates',
    price: '$14.50',
    unit: 'per unit',
    thc: '82%',
    cbd: '0.5%',
    stock: '1,500 units',
    badge: 'New',
    badgeColor: '#60A5FA',
    location: 'Las Cruces, NM',
  },
  {
    id: '4',
    name: 'Distillate — Full Spectrum',
    vendor: 'Rio Grande Extracts',
    type: 'Concentrates',
    price: '$8.00',
    unit: 'per gram',
    thc: '91%',
    cbd: '1.2%',
    stock: '800 g',
    badge: 'Available',
    badgeColor: '#4ADE80',
    location: 'Albuquerque, NM',
  },
  {
    id: '5',
    name: 'Infused Pre-rolls 5pk',
    vendor: 'Duke City Cannabis',
    type: 'Pre-rolls',
    price: '$28.00',
    unit: 'per pack',
    thc: '35%',
    cbd: '0.3%',
    stock: '600 packs',
    badge: 'Hot',
    badgeColor: '#F97316',
    location: 'Albuquerque, NM',
  },
  {
    id: '6',
    name: 'THC Gummies 100mg',
    vendor: 'Tierra Edibles',
    type: 'Edibles',
    price: '$4.50',
    unit: 'per unit',
    thc: '100mg',
    cbd: '0mg',
    stock: '2,400 units',
    badge: 'Available',
    badgeColor: '#4ADE80',
    location: 'Taos, NM',
  },
];

function ListingCard({ item, onPress }: { item: typeof LISTINGS[0]; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-white font-semibold text-base mb-0.5">{item.name}</Text>
          <Text className="text-gray-400 text-xs">{item.vendor}</Text>
        </View>
        <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: item.badgeColor + '22' }}>
          <Text className="text-xs font-semibold" style={{ color: item.badgeColor }}>{item.badge}</Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3">
        <Text className="text-[#4ADE80] text-xl font-bold mr-1">{item.price}</Text>
        <Text className="text-gray-500 text-xs">{item.unit}</Text>
      </View>

      <View className="flex-row gap-4">
        <View>
          <Text className="text-gray-500 text-xs mb-0.5">THC</Text>
          <Text className="text-white text-sm font-medium">{item.thc}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs mb-0.5">CBD</Text>
          <Text className="text-white text-sm font-medium">{item.cbd}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-xs mb-0.5">In Stock</Text>
          <Text className="text-white text-sm font-medium">{item.stock}</Text>
        </View>
        <View className="flex-1 items-end">
          <Text className="text-gray-500 text-xs mb-0.5">Location</Text>
          <Text className="text-gray-400 text-xs">{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MarketplaceScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = LISTINGS.filter(l => {
    const matchCat = activeCategory === 'All' || l.type === activeCategory;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.vendor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      <View className="px-5 pt-4 mb-4">
        <Text className="text-white text-2xl font-bold mb-1">Marketplace</Text>
        <Text className="text-gray-400 text-sm">{LISTINGS.length} listings · New Mexico</Text>
      </View>

      <View className="px-5 mb-4">
        <View className="flex-row items-center bg-[#0F1A12] border border-[#1E3A23] rounded-xl px-4 py-3">
          <Text className="text-gray-500 mr-2 text-base">🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search products or vendors..."
            placeholderTextColor="#4B5563"
            className="flex-1 text-white text-sm"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 pl-5" style={{ flexGrow: 0 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            className={`mr-2 px-4 py-2 rounded-full border ${
              activeCategory === cat ? 'bg-[#4ADE80] border-[#4ADE80]' : 'bg-transparent border-[#1E3A23]'
            }`}
            activeOpacity={0.7}
          >
            <Text className={`text-sm font-medium ${activeCategory === cat ? 'text-[#070D09]' : 'text-gray-400'}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onPress={() => router.push(`/marketplace/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View className="mt-16 items-center">
            <Text className="text-4xl mb-3">🌿</Text>
            <Text className="text-white font-semibold mb-1">No listings found</Text>
            <Text className="text-gray-400 text-sm">Try a different search or category</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
