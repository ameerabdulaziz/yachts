import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const featuredYachts = [
    {
      id: '1',
      name: 'De Antonio D29',
      location: 'El Gouna, Egypt',
      price: '€1,425/day',
      image: 'https://static.wixstatic.com/media/0fb4c8_b9744cfa841b4c4388ad78ac9b49bbe7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D29.jpg',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'De Antonio D42',
      location: 'El Gouna, Egypt',
      price: '€3,420/day',
      image: 'https://static.wixstatic.com/media/0fb4c8_008f1545c8764f8789a2b7415ca9dde7~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D42.jpg',
      rating: 4.9,
    },
    {
      id: '3',
      name: 'De Antonio D50',
      location: 'El Gouna, Egypt',
      price: '€4,470/day',
      image: 'https://static.wixstatic.com/media/0fb4c8_60988eb5cf834fcb876c1d06bd8af594~mv2.jpg/v1/crop/x_0,y_129,w_1920,h_823/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/THE%20RANGE_PORTADA_D50.jpg',
      rating: 4.7,
    },
    {
      id: '4',
      name: 'De Antonio D60',
      location: 'El Gouna, Egypt',
      price: '€8,465/day',
      image: 'https://static.wixstatic.com/media/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg/v1/fill/w_800,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/5c3629_a8b1aa6ff9244bddaf7383aa45b4afc1~mv2.jpg',
      rating: 4.8,
    },
  ];

  const services = [
    { icon: 'boat-outline', title: 'Yacht Charter', subtitle: 'Luxury rentals' },
    { icon: 'people-outline', title: 'Fractional Ownership', subtitle: 'Share ownership' },
    { icon: 'card-outline', title: 'Fuel Wallet', subtitle: 'Prepaid system' },
    { icon: 'location-outline', title: 'Concierge', subtitle: 'Full service' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#2563eb', '#1e40af']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome to Nauttec</Text>
            <Text style={styles.subGreeting}>Discover luxury yachts</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <TouchableOpacity key={index} style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <Ionicons name={service.icon as any} size={24} color="#2563eb" />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Yachts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Yachts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.yachtsScroll}
          >
            {featuredYachts.map((yacht) => (
              <TouchableOpacity key={yacht.id} style={styles.yachtCard}>
                <Image source={{ uri: yacht.image }} style={styles.yachtImage} />
                <View style={styles.yachtOverlay}>
                  <View style={styles.yachtRating}>
                    <Ionicons name="star" size={12} color="#fbbf24" />
                    <Text style={styles.ratingText}>{yacht.rating}</Text>
                  </View>
                </View>
                <View style={styles.yachtInfo}>
                  <Text style={styles.yachtName}>{yacht.name}</Text>
                  <View style={styles.yachtDetails}>
                    <Ionicons name="location-outline" size={14} color="#6b7280" />
                    <Text style={styles.yachtLocation}>{yacht.location}</Text>
                  </View>
                  <Text style={styles.yachtPrice}>{yacht.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Trips Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>$2,400</Text>
              <Text style={styles.statLabel}>Fuel Wallet</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>25%</Text>
              <Text style={styles.statLabel}>Ownership Share</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subGreeting: {
    fontSize: 16,
    color: '#e0e7ff',
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  yachtsScroll: {
    marginTop: 16,
  },
  yachtCard: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  yachtImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  yachtOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  yachtRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  yachtInfo: {
    padding: 16,
  },
  yachtName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  yachtDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  yachtLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  yachtPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
});