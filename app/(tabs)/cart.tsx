import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../src/store/cartStore';

export default function CartScreen() {
  const router = useRouter();
  const { vendorGroups, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCartStore();

  const groups = vendorGroups();
  const vendors = Object.keys(groups);
  const subtotal = totalPrice();
  const platformFee = parseFloat((subtotal * 0.03).toFixed(2));
  const grandTotal = parseFloat((subtotal + platformFee).toFixed(2));

  const handleCheckout = () => {
    Alert.alert(
      'Place Orders',
      'Submit orders to ' + vendors.length + ' vendor' + (vendors.length > 1 ? 's' : '') + ' for $' + grandTotal.toFixed(2) + ' total?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Place',
          onPress: () => {
            clearCart();
            Alert.alert('Orders Placed!', 'Your orders have been submitted. Check the Orders tab for status updates.', [
              { text: 'View Orders', onPress: () => router.push('/(tabs)/orders') },
            ]);
          },
        },
      ]
    );
  };

  if (totalItems() === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>Add products from the Marketplace to get started.</Text>
        <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/marketplace')}>
          <Text style={styles.browseBtnText}>Browse Marketplace</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: clearCart },
        ])}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {vendors.map((vendor) => {
          const items = groups[vendor];
          const vendorSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          return (
            <View key={vendor} style={styles.vendorSection}>
              <View style={styles.vendorHeader}>
                <Text style={styles.vendorIcon}>🏭</Text>
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{vendor}</Text>
                  <Text style={styles.vendorLicense}>License: {items[0]?.vendorLicense || 'NM-XXXX'}</Text>
                </View>
                <Text style={styles.vendorTotal}>${vendorSubtotal.toFixed(2)}</Text>
              </View>
              {items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)} / {item.unit}</Text>
                  </View>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => {
                        if (item.quantity <= 1) {
                          Alert.alert('Remove Item', 'Remove ' + item.name + ' from cart?', [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.id) },
                          ]);
                        } else { updateQty(item.id, item.quantity - 1); }
                      }}
                    >
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, item.quantity + 1)}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.itemSubtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          );
        })}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({totalItems()} item{totalItems() !== 1 ? 's' : ''})</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee (3%)</Text>
            <Text style={styles.summaryValue}>${platformFee.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValueAlt}>Arranged by vendor</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.footerMeta}>
          <Text style={styles.footerItems}>{totalItems()} item{totalItems() !== 1 ? 's' : ''} · {vendors.length} vendor{vendors.length > 1 ? 's' : ''}</Text>
          <Text style={styles.footerTotal}>${grandTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Text style={styles.checkoutBtnText}>Place Orders →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d1117' },
  emptyContainer: { flex: 1, backgroundColor: '#0d1117', alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#f0f0f0', marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: '#8b949e', textAlign: 'center', marginBottom: 32 },
  browseBtn: { backgroundColor: '#22c55e', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 12 },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#f0f0f0' },
  clearText: { fontSize: 14, color: '#ef4444', fontWeight: '600' },
  scroll: { flex: 1, paddingHorizontal: 16 },
  vendorSection: { backgroundColor: '#161b22', borderRadius: 14, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#21262d' },
  vendorHeader: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#21262d', backgroundColor: '#1c2128' },
  vendorIcon: { fontSize: 22, marginRight: 10 },
  vendorInfo: { flex: 1 },
  vendorName: { fontSize: 15, fontWeight: '700', color: '#f0f0f0' },
  vendorLicense: { fontSize: 11, color: '#8b949e', marginTop: 2 },
  vendorTotal: { fontSize: 15, fontWeight: '700', color: '#22c55e' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#21262d' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#f0f0f0' },
  itemPrice: { fontSize: 12, color: '#8b949e', marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
  qtyBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#21262d', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: '#f0f0f0', fontSize: 18, fontWeight: '600', lineHeight: 22 },
  qtyValue: { fontSize: 15, fontWeight: '700', color: '#f0f0f0', marginHorizontal: 10, minWidth: 20, textAlign: 'center' },
  itemSubtotal: { fontSize: 14, fontWeight: '700', color: '#f0f0f0', minWidth: 64, textAlign: 'right' },
  summaryCard: { backgroundColor: '#161b22', borderRadius: 14, padding: 18, marginTop: 4, marginBottom: 8, borderWidth: 1, borderColor: '#21262d' },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#f0f0f0', marginBottom: 14 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: '#8b949e' },
  summaryValue: { fontSize: 14, color: '#f0f0f0', fontWeight: '500' },
  summaryValueAlt: { fontSize: 14, color: '#8b949e', fontStyle: 'italic' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#21262d', marginTop: 6, paddingTop: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#f0f0f0' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#22c55e' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#161b22', padding: 20, borderTopWidth: 1, borderTopColor: '#21262d' },
  footerMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  footerItems: { fontSize: 13, color: '#8b949e' },
  footerTotal: { fontSize: 16, fontWeight: '800', color: '#22c55e' },
  checkoutBtn: { backgroundColor: '#22c55e', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  checkoutBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});