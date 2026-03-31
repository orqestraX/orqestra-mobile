import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, FlatList, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../src/store/cartStore';

const ALL_PRODUCTS = [
  { id:'1', name:'Blue Dream — Indoor (AAA)', vendor:'High Desert Farms', vendorLicense:'NM-CUL-2024-001', category:'Flower', price:650, unit:'lb', minOrder:'1 lb', rating:4.8, reviews:34, badge:'Top Seller', badgeColor:'#22c55e', thc:'24%', available:'48 lbs', emoji:'🌸' },
  { id:'2', name:'OG Kush — Indoor (AA+)', vendor:'Rio Grande Cannabis Co.', vendorLicense:'NM-CUL-2024-008', category:'Flower', price:550, unit:'lb', minOrder:'2 lbs', rating:4.6, reviews:21, badge:'Verified', badgeColor:'#3b82f6', thc:'22%', available:'120 lbs', emoji:'🌿' },
  { id:'3', name:'Live Resin — GSC (1g)', vendor:'Elevated Extracts NM', vendorLicense:'NM-MAN-2024-015', category:'Concentrates', price:18, unit:'unit', minOrder:'50 units', rating:4.9, reviews:57, badge:'Featured', badgeColor:'#f59e0b', thc:'82%', available:'500 units', emoji:'🟡' },
  { id:'4', name:'Pre-Roll Pack — Sativa Mix (10pk)', vendor:'Mesa Verde Manufacturing', vendorLicense:'NM-MAN-2024-022', category:'Pre-Rolls', price:32, unit:'pack', minOrder:'20 packs', rating:4.7, reviews:18, badge:null, badgeColor:'', thc:'18-22%', available:'200 packs', emoji:'🚬' },
  { id:'5', name:'Sour Diesel — Sun-Grown', vendor:'Enchanted Valley Farms', vendorLicense:'NM-CUL-2024-033', category:'Flower', price:500, unit:'lb', minOrder:'1 lb', rating:4.5, reviews:12, badge:'New', badgeColor:'#8b5cf6', thc:'20%', available:'80 lbs', emoji:'☀️' },
  { id:'6', name:'Gummies — Mixed Fruit 10mg (20pk)', vendor:'Southwest Sweets LLC', vendorLicense:'NM-MAN-2024-041', category:'Edibles', price:28, unit:'pack', minOrder:'30 packs', rating:4.6, reviews:29, badge:null, badgeColor:'', thc:'10mg/piece', available:'1,000 packs', emoji:'🍬' },
  { id:'7', name:'Trim & Shake — Mixed Indoor', vendor:'High Desert Farms', vendorLicense:'NM-CUL-2024-001', category:'Trim', price:150, unit:'lb', minOrder:'5 lbs', rating:4.3, reviews:9, badge:null, badgeColor:'', thc:'12-16%', available:'200 lbs', emoji:'🍃' },
  { id:'8', name:'Distillate Cart — 1g OG', vendor:'Elevated Extracts NM', vendorLicense:'NM-MAN-2024-015', category:'Concentrates', price:12, unit:'unit', minOrder:'100 units', rating:4.7, reviews:41, badge:'Top Seller', badgeColor:'#22c55e', thc:'88%', available:'1,200 units', emoji:'💧' },
];

const CATEGORIES = ['All', 'Flower', 'Concentrates', 'Pre-Rolls', 'Edibles', 'Trim'];
const SORT_OPTIONS = ['Featured', 'Price ↑', 'Price ↓', 'Top Rated'];

export default function MarketplaceScreen() {
  const router = useRouter();
  const { addItem, totalItems } = useCartStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Featured');
  const [showSort, setShowSort] = useState(false);

  const filtered = ALL_PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'Price ↑') return a.price - b.price;
      if (sort === 'Price ↓') return b.price - a.price;
      if (sort === 'Top Rated') return b.rating - a.rating;
      return 0;
    });

  const handleAddToCart = (item: typeof ALL_PRODUCTS[0]) => {
    addItem({
      id: item.id + '_' + Date.now(),
      productId: item.id,
      name: item.name,
      vendor: item.vendor,
      vendorLicense: item.vendorLicense,
      price: item.price,
      unit: item.unit,
      quantity: 1,
    });
    Alert.alert('Added to Cart', item.name + ' added.', [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'View Cart (' + (totalItems() + 1) + ')', onPress: () => router.push('/(tabs)/cart') },
    ]);
  };

  const cartCount = totalItems();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with cart badge */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Marketplace</Text>
          <Text style={styles.headerSub}>New Mexico</Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/(tabs)/cart')}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder='Search products, vendors, strains...'
            placeholderTextColor='#4b5563'
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#6b7280', fontSize: 16, paddingHorizontal: 8 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSort(!showSort)}>
          <Text style={styles.sortBtnText}>{sort} ▾</Text>
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={styles.sortDropdown}>
          {SORT_OPTIONS.map(o => (
            <TouchableOpacity key={o} style={styles.sortOption} onPress={() => { setSort(o); setShowSort(false); }}>
              <Text style={[styles.sortOptionText, sort === o && styles.sortOptionActive]}>{o}</Text>
              {sort === o && <Text style={{ color: '#22c55e' }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Category pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.catPill, category === c && styles.catPillActive]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.catPillText, category === c && styles.catPillTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}{category !== 'All' ? ' in ' + category : ''}</Text>
      </View>

      {/* Product grid */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.emptyState}><Text style={styles.emptyIcon}>🔍</Text><Text style={styles.emptyText}>No products match your search</Text></View>}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {/* Image area */}
            <View style={styles.productImageArea}>
              <Text style={styles.productEmoji}>{item.emoji}</Text>
              {item.badge && (
                <View style={[styles.badgeChip, { backgroundColor: item.badgeColor + '22', borderColor: item.badgeColor + '44' }]}>
                  <Text style={[styles.badgeChipText, { color: item.badgeColor }]}>{item.badge}</Text>
                </View>
              )}
            </View>
            {/* Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{item.category}</Text>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productVendor} numberOfLines={1}>by {item.vendor}</Text>
              {/* Stars */}
              <View style={styles.starsRow}>
                <Text style={styles.starsText}>{'★'.repeat(Math.round(item.rating))}</Text>
                <Text style={styles.reviewCount}>({item.reviews})</Text>
              </View>
              {/* Price */}
              <Text style={styles.productPrice}>${item.price}<Text style={styles.productUnit}>/{item.unit}</Text></Text>
              <Text style={styles.productMin}>Min: {item.minOrder}</Text>
              {/* Add to cart */}
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
                <Text style={styles.addBtnText}>+ Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  headerLeft: {},
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#f0f6ff' },
  headerSub: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  cartBtn: { position: 'relative', padding: 8 },
  cartIcon: { fontSize: 24 },
  cartBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: '#22c55e', borderRadius: 10, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#161b22', borderRadius: 10, borderWidth: 1, borderColor: '#21262d', paddingHorizontal: 10 },
  searchIcon: { fontSize: 14, marginRight: 6, color: '#8b949e' },
  searchInput: { flex: 1, color: '#f0f6ff', fontSize: 13, paddingVertical: 9 },
  sortBtn: { backgroundColor: '#161b22', borderRadius: 10, borderWidth: 1, borderColor: '#21262d', paddingHorizontal: 12, paddingVertical: 9 },
  sortBtnText: { color: '#8b949e', fontSize: 12, fontWeight: '600' },
  sortDropdown: { position: 'absolute', right: 16, top: 110, backgroundColor: '#161b22', borderRadius: 12, borderWidth: 1, borderColor: '#21262d', zIndex: 100, minWidth: 150, overflow: 'hidden' },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#21262d' },
  sortOptionText: { color: '#8b949e', fontSize: 13 },
  sortOptionActive: { color: '#22c55e', fontWeight: '700' },
  catScroll: { flexGrow: 0 },
  catContent: { paddingHorizontal: 16, paddingBottom: 10, gap: 8 },
  catPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: '#161b22', borderWidth: 1, borderColor: '#21262d' },
  catPillActive: { backgroundColor: '#14532d', borderColor: '#22c55e' },
  catPillText: { color: '#8b949e', fontSize: 12, fontWeight: '600' },
  catPillTextActive: { color: '#4ade80' },
  resultsRow: { paddingHorizontal: 16, paddingBottom: 8 },
  resultsText: { color: '#6b7280', fontSize: 11 },
  grid: { paddingHorizontal: 12, paddingBottom: 20 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: '#6b7280', fontSize: 14 },
  productCard: { flex: 1, margin: 4, backgroundColor: '#161b22', borderRadius: 12, borderWidth: 1, borderColor: '#21262d', overflow: 'hidden' },
  productImageArea: { height: 110, backgroundColor: '#0d1117', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  productEmoji: { fontSize: 44 },
  badgeChip: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  badgeChipText: { fontSize: 9, fontWeight: '700' },
  productInfo: { padding: 10 },
  productCategory: { fontSize: 9, color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  productName: { fontSize: 12, fontWeight: '700', color: '#f0f6ff', marginBottom: 2, lineHeight: 16 },
  productVendor: { fontSize: 10, color: '#6b7280', marginBottom: 4 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  starsText: { color: '#fbbf24', fontSize: 10 },
  reviewCount: { color: '#6b7280', fontSize: 9 },
  productPrice: { fontSize: 16, fontWeight: '800', color: '#22c55e', marginBottom: 1 },
  productUnit: { fontSize: 10, color: '#6b7280', fontWeight: '400' },
  productMin: { fontSize: 9, color: '#6b7280', marginBottom: 8 },
  addBtn: { backgroundColor: '#14532d', borderRadius: 8, paddingVertical: 7, alignItems: 'center', borderWidth: 1, borderColor: '#22c55e44' },
  addBtnText: { color: '#4ade80', fontSize: 11, fontWeight: '700' },
});