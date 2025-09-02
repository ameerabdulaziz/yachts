import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Yacht {
  id: string;
  name: string;
  model: string;
  location: string;
  pricePerDay: number;
  capacity: number;
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
}

export default function YachtsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const yachts: Yacht[] = [
    {
      id: '1',
      name: 'Sea Breeze',
      model: 'De Antonio D29',
      location: 'Monaco',
      pricePerDay: 1200,
      capacity: 8,
      imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
      rating: 4.8,
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Ocean Pearl',
      model: 'De Antonio D46',
      location: 'Ibiza',
      pricePerDay: 2800,
      capacity: 12,
      imageUrl: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400',
      rating: 4.9,
      isAvailable: true,
    },
    {
      id: '3',
      name: 'Azure Dream',
      model: 'De Antonio D50',
      location: 'Saint-Tropez',
      pricePerDay: 3500,
      capacity: 14,
      imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400',
      rating: 4.7,
      isAvailable: false,
    },
    {
      id: '4',
      name: 'Marina Star',
      model: 'De Antonio D33',
      location: 'Cannes',
      pricePerDay: 1800,
      capacity: 10,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      rating: 4.6,
      isAvailable: true,
    },
  ];

  const filteredYachts = yachts.filter(yacht => {
    const matchesSearch = yacht.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         yacht.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         yacht.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'available') return matchesSearch && yacht.isAvailable;
    return matchesSearch;
  });

  const renderYachtCard = ({ item }: { item: Yacht }) => (
    <TouchableOpacity style={styles.yachtCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.yachtImage} />
      
      {!item.isAvailable && (
        <View style={styles.unavailableBadge}>
          <Text style={styles.unavailableText}>Unavailable</Text>
        </View>
      )}
      
      <View style={styles.yachtInfo}>
        <View style={styles.yachtHeader}>
          <Text style={styles.yachtName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.yachtModel}>{item.model}</Text>
        
        <View style={styles.yachtDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{item.capacity} guests</Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.pricePerDay.toLocaleString()}/day</Text>
          <TouchableOpacity 
            style={[styles.bookButton, !item.isAvailable && styles.bookButtonDisabled]}
            disabled={!item.isAvailable}
          >
            <Text style={[styles.bookButtonText, !item.isAvailable && styles.bookButtonTextDisabled]}>
              {item.isAvailable ? 'Book Now' : 'Unavailable'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search yachts, locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filterType === 'all' && styles.filterTabActive]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterTabText, filterType === 'all' && styles.filterTabTextActive]}>
            All Yachts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filterType === 'available' && styles.filterTabActive]}
          onPress={() => setFilterType('available')}
        >
          <Text style={[styles.filterTabText, filterType === 'available' && styles.filterTabTextActive]}>
            Available
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <Text style={styles.resultsText}>
        {filteredYachts.length} yacht{filteredYachts.length !== 1 ? 's' : ''} found
      </Text>

      {/* Yachts List */}
      <FlatList
        data={filteredYachts}
        renderItem={renderYachtCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  filterTabActive: {
    backgroundColor: '#2563eb',
  },
  filterTabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#ffffff',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  yachtCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  yachtImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unavailableText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  yachtInfo: {
    padding: 16,
  },
  yachtHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  yachtName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
    fontWeight: '600',
  },
  yachtModel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  yachtDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  bookButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bookButtonTextDisabled: {
    color: '#9ca3af',
  },
});