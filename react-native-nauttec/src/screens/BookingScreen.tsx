import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';

type BookingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Booking'>;
type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;

interface Props {
  navigation: BookingScreenNavigationProp;
  route: BookingScreenRouteProp;
}

export default function BookingScreen({ navigation, route }: Props) {
  const { yachtId } = route.params;
  const [selectedDates, setSelectedDates] = useState({ start: '', end: '' });
  const [guests, setGuests] = useState(4);

  const yacht = {
    name: 'Sea Breeze',
    model: 'De Antonio D29',
    pricePerDay: 1200,
  };

  const calculateTotal = () => {
    const days = selectedDates.start && selectedDates.end ? 3 : 0;
    const subtotal = yacht.pricePerDay * days;
    const tax = subtotal * 0.15;
    return { days, subtotal, tax, total: subtotal + tax };
  };

  const handleBooking = () => {
    Alert.alert(
      'Booking Confirmation',
      'Your yacht booking has been submitted for confirmation.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  const { days, subtotal, tax, total } = calculateTotal();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Yacht Summary */}
        <View style={styles.yachtSummary}>
          <Text style={styles.yachtName}>{yacht.name}</Text>
          <Text style={styles.yachtModel}>{yacht.model}</Text>
          <Text style={styles.yachtPrice}>${yacht.pricePerDay}/day</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Dates</Text>
          <View style={styles.dateContainer}>
            <TouchableOpacity style={styles.dateButton}>
              <View style={styles.dateButtonContent}>
                <Ionicons name="calendar-outline" size={20} color="#2563eb" />
                <View style={styles.dateText}>
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>Sep 15, 2024</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.dateButton}>
              <View style={styles.dateButtonContent}>
                <Ionicons name="calendar-outline" size={20} color="#2563eb" />
                <View style={styles.dateText}>
                  <Text style={styles.dateLabel}>Check-out</Text>
                  <Text style={styles.dateValue}>Sep 18, 2024</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Guests Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Guests</Text>
          <View style={styles.guestSelector}>
            <TouchableOpacity 
              style={[styles.guestButton, guests <= 1 && styles.guestButtonDisabled]}
              onPress={() => setGuests(Math.max(1, guests - 1))}
              disabled={guests <= 1}
            >
              <Ionicons name="remove" size={20} color={guests <= 1 ? "#9ca3af" : "#2563eb"} />
            </TouchableOpacity>
            
            <View style={styles.guestCount}>
              <Text style={styles.guestNumber}>{guests}</Text>
              <Text style={styles.guestLabel}>guests</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.guestButton, guests >= 8 && styles.guestButtonDisabled]}
              onPress={() => setGuests(Math.min(8, guests + 1))}
              disabled={guests >= 8}
            >
              <Ionicons name="add" size={20} color={guests >= 8 ? "#9ca3af" : "#2563eb"} />
            </TouchableOpacity>
          </View>
          <Text style={styles.guestNote}>Maximum 8 guests for this yacht</Text>
        </View>

        {/* Additional Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Services</Text>
          
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceLeft}>
              <Ionicons name="restaurant-outline" size={20} color="#2563eb" />
              <View style={styles.serviceText}>
                <Text style={styles.serviceName}>Catering Service</Text>
                <Text style={styles.serviceDescription}>Professional catering for your trip</Text>
              </View>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.servicePrice}>+$200</Text>
              <View style={styles.checkbox} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceLeft}>
              <Ionicons name="person-outline" size={20} color="#2563eb" />
              <View style={styles.serviceText}>
                <Text style={styles.serviceName}>Captain Service</Text>
                <Text style={styles.serviceDescription}>Professional captain included</Text>
              </View>
            </View>
            <View style={styles.serviceRight}>
              <Text style={styles.servicePrice}>+$300</Text>
              <View style={styles.checkbox} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>${yacht.pricePerDay} × {days} days</Text>
              <Text style={styles.priceValue}>${subtotal.toLocaleString()}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes & fees</Text>
              <Text style={styles.priceValue}>${tax.toFixed(0)}</Text>
            </View>
            
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
          <Text style={styles.termsText}>
            By booking, you agree to our Terms of Service and Cancellation Policy
          </Text>
        </View>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.bottomTotal}>${total.toLocaleString()}</Text>
          <Text style={styles.bottomTotalLabel}>Total</Text>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  yachtSummary: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  yachtName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  yachtModel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  yachtPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 2,
  },
  guestSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  guestButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  guestCount: {
    alignItems: 'center',
    marginHorizontal: 32,
  },
  guestNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  guestLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  guestNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  serviceText: {
    marginLeft: 12,
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  serviceDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  serviceRight: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginTop: 4,
  },
  priceBreakdown: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    lineHeight: 16,
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalContainer: {
    alignItems: 'flex-start',
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});