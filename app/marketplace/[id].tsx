import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

const LISTINGS: Record<string, {
  id: string; name: string; vendor: string; type: string;
  price: string; unit: string; thc: string; cbd: string;
  stock: string; badge: string; badgeColor: string; location: string;
  description: string; minOrder: string; turnaround: string; license: string;
}> = {
  '1': {
    id: '1', name: 'Blue Dream — Indoor', vendor: 'High Desert Farms', type: 'Flower',
    price: '$1,200', unit: 'per lb', thc: '24%', cbd: '0.1%', stock: '48 lbs',
    badge: 'Available', badgeColor: '#4ADE80', location: 'Albuquerque, NM',
    description: 'Premium indoor-grown Blue Dream with consistent terpene profile. Dense, well-cured nugs. Ideal for dispensary shelf or further processing. Pesticide-free, tested and certified.',
    minOrder: '5 lbs', turnaround: '2–3 business days', license: 'NM-CULT-00482',
  },
  '2': {
    id: '2', name: 'OG Kush — Greenhouse', vendor: 'Sandia Cultivators', type: 'Flower',
    price: '$950', unit: 'per lb', thc: '21%', cbd: '0.2%', stock: '120 lbs',
    badge: 'Bulk Deal', badgeColor: '#FACC15', location: 'Santa Fe, NM',
    description: 'Greenhouse OG Kush at volume pricing. Classic earthy aroma, sticky resin. Discounts available on orders over 20 lbs. Great for pre-roll production.',
    minOrder: '10 lbs', turnaround: '1–2 business days', license: 'NM-CULT-00319',
  },
  '3': {
    id: '3', name: 'Live Resin Cartridge', vendor: 'NM Extract Labs', type: 'Concentrates',
    price: '$14.50', unit: 'per unit', thc: '82%', cbd: '0.5%', stock: '1,500 units',
    badge: 'New', badgeColor: '#60A5FA', location: 'Las Cruces, NM',
    description: 'Full-spectrum live resin in a 1g ceramic core cartridge. Solventless extraction. White-label packaging available. Lab COAs included with every order.',
    minOrder: '100 units', turnaround: '3–5 business days', license: 'NM-MFG-00751',
  },
  '4': {
    id: '4', name: 'Distillate — Full Spectrum', vendor: 'Rio Grande Extracts', type: 'Concentrates',
    price: '$8.00', unit: 'per gram', thc: '91%', cbd: '1.2%', stock: '800 g',
    badge: 'Available', badgeColor: '#4ADE80', location: 'Albuquerque, NM',
    description: 'D9 distillate with naturally preserved minor cannabinoids. Ideal for edible infusion, cartridge fill, or tincture base. Bulk pricing at 500g+.',
    minOrder: '50 g', turnaround: '2–3 business days', license: 'NM-MFG-00614',
  },
  '5': {
    id: '5', name: 'Infused Pre-rolls 5pk', vendor: 'Duke City Cannabis', type: 'Pre-rolls',
    price: '$28.00', unit: 'per pack', thc: '35%', cbd: '0.3%', stock: '600 packs',
    badge: 'Hot', badgeColor: '#F97316', location: 'Albuquerque, NM',
    description: 'King-size pre-rolls infused with live resin and dusted in kief. Top-seller in Albuquerque retail. Display-ready retail packaging. Shelf-stable 90 days.',
    minOrder: '50 packs', turnaround: '2–4 business days', license: 'NM-MFG-00887',
  },
  '6': {
    id: '6', name: 'THC Gummies 100mg', vendor: 'Tierra Edibles', type: 'Edibles',
    price: '$4.50', unit: 'per unit', thc: '100mg', cbd: '0mg', stock: '2,400 units',
    badge: 'Available', badgeColor: '#4ADE80', location: 'Taos, NM',
    description: 'Pectin-based vegan gummies. 10-count retail packs (10mg each) or single 100mg units. Consistent dosing, 3rd-party tested every batch. Flavors: Watermelon, Mango, Berry.',
    minOrder: '200 units', turnaround: '3–5 business days', license: 'NM-MFG-00562',
  },
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-[#1E3A23]">
      <Text className="text-gray-400 text-sm">{label}</Text>
      <Text className="text-white text-sm font-medium">{value}</Text>
    </View>
  );
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = LISTINGS[id ?? '1'];

  if (!item) return (
    <SafeAreaView className="flex-1 bg-[#070D09] items-center justify-center">
      <Text className="text-white">Listing not found</Text>
    </SafeAreaView>
  );

  const handleOrder = () => {
    Alert.alert('Place Order', `Start an order for ${item.name} from ${item.vendor}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: () => router.push('/orders/create') },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1">
          <Text className="text-[#4ADE80] text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="text-white font-semibold flex-1" numberOfLines={1}>{item.type}</Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Card */}
        <View className="mx-5 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-5 mb-5">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-white text-xl font-bold mb-1">{item.name}</Text>
              <Text className="text-gray-400 text-sm">{item.vendor}</Text>
              <Text className="text-gray-500 text-xs mt-0.5">📍 {item.location}</Text>
            </View>
            <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: item.badgeColor + '22' }}>
              <Text className="text-xs font-bold" style={{ color: item.badgeColor }}>{item.badge}</Text>
            </View>
          </View>

          <View className="flex-row items-baseline mb-4">
            <Text className="text-[#4ADE80] text-3xl font-bold mr-1">{item.price}</Text>
            <Text className="text-gray-400 text-sm">{item.unit}</Text>
          </View>

          <View className="flex-row gap-4">
            {[['THC', item.thc], ['CBD', item.cbd], ['Stock', item.stock]].map(([label, val]) => (
              <View key={label} className="flex-1 bg-[#070D09] rounded-xl p-3 items-center">
                <Text className="text-gray-400 text-xs mb-1">{label}</Text>
                <Text className="text-white font-bold text-sm">{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="mx-5 mb-5">
          <Text className="text-white font-semibold text-base mb-2">About this listing</Text>
          <Text className="text-gray-400 text-sm leading-5">{item.description}</Text>
        </View>

        {/* Order Details */}
        <View className="mx-5 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl px-4 mb-5">
          <Text className="text-white font-semibold text-base pt-4 mb-1">Order Details</Text>
          <InfoRow label="Minimum Order" value={item.minOrder} />
          <InfoRow label="Turnaround" value={item.turnaround} />
          <InfoRow label="Vendor License" value={item.license} />
          <InfoRow label="Compliance" value="State-verified ✓" />
        </View>

        {/* Vendor */}
        <View className="mx-5 bg-[#0F1A12] border border-[#1E3A23] rounded-2xl p-4">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#1E3A23] border border-[#4ADE80]/30 items-center justify-center mr-3">
              <Text className="text-[#4ADE80] font-bold text-sm">
                {item.vendor.split(' ').map(w => w[0]).join('').slice(0,2)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold">{item.vendor}</Text>
              <Text className="text-gray-400 text-xs">{item.location} · Licensed Operator</Text>
            </View>
            <TouchableOpacity className="border border-[#1E3A23] px-3 py-1.5 rounded-lg">
              <Text className="text-gray-300 text-xs">View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-[#070D09] border-t border-[#1E3A23]">
        <TouchableOpacity
          onPress={handleOrder}
          className="bg-[#4ADE80] rounded-2xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-[#070D09] font-bold text-base">Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
