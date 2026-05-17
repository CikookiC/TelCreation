// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Daftar kategori yang tersedia (sesuai rumpun karya di SMK Telkom)
const CATEGORIES = ['Semua', 'UI/UX Design', 'Web Development', 'Mobile App', 'Game Dev', 'IoT', 'Jaringan/Siber'];

export default function HomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setProjects(list);
      } catch (error) {
        console.error("Error fetching projects: ", error);
        alert("Gagal memuat data dari server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter pencarian dinamis + filter kategori sekaligus
  const filteredProjects = projects.filter(proj => {
    const titleMatch = (proj.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = (proj.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    const creatorMatch = (proj.creator || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // Logika filter kategori
    const matchesCategory = selectedCategory === 'Semua' || (proj.category || '').toLowerCase() === selectedCategory.toLowerCase();

    return (titleMatch || categoryMatch || creatorMatch) && matchesCategory;
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#E21921" />
        <Text style={{ marginTop: 10, color: '#666' }}>Memuat halaman...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO SECTION */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Unjuk Karya,{"\n"}Wujudkan Prestasi</Text>
            <Text style={styles.heroSubtitle}>Platform resmi untuk menampilkan portofolio dan karya digital terbaik siswa SMK Telkom.</Text>
          </View>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginLeft: 15 }} />
        <TextInput 
          placeholder="Cari karya, kategori, atau nama siswa..." 
          style={styles.searchInput} 
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* HORIZONTAL CATEGORIES FILTER */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.categoryItem, isSelected && styles.categoryItemActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* KARYA TERBARU */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'Semua' ? 'Karya Terbaru' : `Karya ${selectedCategory}`}
        </Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.seeAll}>Lihat Semua </Text>
          <Ionicons name="chevron-forward" size={14} color="#E21921" />
        </TouchableOpacity>
      </View>

      {/* GRID KARYA DINAMIS / EMPTY STATE */}
      {filteredProjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={50} color="#CCC" />
          <Text style={styles.emptyText}>Tidak ada karya ditemukan</Text>
          <Text style={styles.emptySubtext}>Belum ada siswa yang merilis karya di kategori "{selectedCategory}" saat ini.</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalGrid}>
          {filteredProjects.map((proj) => {
            const hasImage = proj.image && proj.image.trim() !== '' && proj.image !== 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400';

            return (
              <TouchableOpacity 
                key={proj.id} 
                style={styles.card} 
                onPress={() => navigation.navigate('ProjectDetail', { project: proj })}
              >
                {hasImage ? (
                  <Image source={{ uri: proj.image }} style={styles.cardImage} />
                ) : (
                  <View style={styles.noImagePlaceholder}>
                    <Ionicons name="image-outline" size={24} color="#AAA" />
                    <Text style={styles.noImageText}>Gambar tidak tersedia</Text>
                  </View>
                )}
                
                <View style={styles.cardBody}>
                  <Text style={styles.cardCategory}>{proj.category || "Umum"}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>{proj.title}</Text>
                  <Text style={styles.cardAuthor}>oleh {proj.creator}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { justifyContent: 'center', alignItems: 'center' },
  heroSection: { backgroundColor: '#E21921', padding: 25, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, paddingTop: 60, paddingBottom: 45 },
  heroTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', lineHeight: 32 },
  heroSubtitle: { color: 'white', fontSize: 13, marginTop: 10, opacity: 0.85, lineHeight: 20 },
  heroContent: { flexDirection: 'row', alignItems: 'center' },
  heroTextContainer: { flex: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', marginHorizontal: 20, marginTop: -25, borderRadius: 25, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, height: 50 },
  searchInput: { flex: 1, paddingRight: 15, paddingLeft: 10, fontSize: 13, color: '#000' },
  
  // STYLES BARU UNTUK KATEGORI HORIZONTAL
  categoryContainer: { marginTop: 20, marginBottom: 5 },
  categoryScroll: { paddingLeft: 20, paddingRight: 10, alignItems: 'center' },
  categoryItem: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', marginRight: 10, borderWidth: 1, borderColor: '#EAEAEA' },
  categoryItemActive: { backgroundColor: '#E21921', borderColor: '#E21921' },
  categoryText: { fontSize: 12, color: '#666', fontWeight: '500' },
  categoryTextActive: { color: '#FFF', fontWeight: 'bold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20, marginBottom: 15 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  seeAll: { color: '#E21921', fontSize: 12, fontWeight: '600' },
  horizontalGrid: { paddingLeft: 20, marginBottom: 10 },
  card: { width: 145, marginRight: 15, backgroundColor: 'white', borderRadius: 18, elevation: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 5, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  cardImage: { width: '100%', height: 95 },
  noImagePlaceholder: { width: '100%', height: 95, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  noImageText: { fontSize: 10, color: '#999', marginTop: 4, fontWeight: '500' },
  cardBody: { padding: 10 },
  cardCategory: { color: '#E21921', fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
  cardTitle: { fontWeight: 'bold', fontSize: 13, color: '#222' },
  cardAuthor: { fontSize: 10, color: '#777', marginTop: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, marginHorizontal: 20, backgroundColor: '#FAFAFA', borderRadius: 18, borderWidth: 1, borderColor: '#EEE', borderStyle: 'dashed' },
  emptyText: { fontWeight: 'bold', fontSize: 14, color: '#555', marginTop: 10 },
  emptySubtext: { fontSize: 11, color: '#888', textAlign: 'center', paddingHorizontal: 30, marginTop: 4, lineHeight: 16 }
});