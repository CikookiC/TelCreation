// src/screens/HomePublikScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function HomePublikScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Game', 'Website', 'Aplikasi', 'Desain', 'UI/UX', 'videografi', 'fotografi'];

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(list);
      setFilteredProjects(list);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = projects;
    if (selectedCategory !== 'Semua') result = result.filter(p => p.category === selectedCategory);
    if (searchQuery.trim() !== '') {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creator.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProjects(result);
  }, [searchQuery, selectedCategory, projects]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#1E2022" /></View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Jumbotron Hitam Keabuan */}
      <View style={styles.jumbotron}>
        <Text style={styles.tagline}>SHOWCASE PLATFORM</Text>
        <Text style={styles.jumbotronTitle}>Pameran Digital</Text>
        <Text style={styles.jumbotronSubtitle}>Jelajahi dan temukan prototipe masa depan karya siswa SMK Telkom.</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#1E2022" style={{ marginRight: 10 }} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Cari inovasi / nama kreator..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0A5AA"
          />
        </View>
      </View>

      {/* Filter Kategori - Aktif Hitam Keabuan */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity key={cat} style={[styles.categoryBtn, isSelected && styles.categoryBtnSelected]} onPress={() => setSelectedCategory(cat)}>
              <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Karya Kreatif Terbaru</Text>
      {filteredProjects.length === 0 ? (
        <Text style={styles.emptyText}>Tidak ada portofolio yang ditemukan.</Text>
      ) : (
        <View style={styles.grid}>
          {filteredProjects.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => navigation.navigate('ProjectDetail', { project: item })}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <View style={styles.badgeRow}><Text style={styles.cardCategory}>{item.category || 'Game'}</Text></View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardCreator}>oleh {item.creator}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  jumbotron: { backgroundColor: '#1E2022', padding: 30, paddingTop: 70, paddingBottom: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, shadowColor: '#1E2022', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 12 },
  tagline: { color: '#8A909A', fontSize: 11, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  jumbotronTitle: { color: '#FFF', fontSize: 28, fontWeight: '800' },
  jumbotronSubtitle: { color: '#A0A5AA', fontSize: 13, marginTop: 6, lineHeight: 20 },
  searchSection: { marginTop: -25, alignItems: 'center', paddingHorizontal: 25 },
  searchBar: { flexDirection: 'row', backgroundColor: '#FFF', width: '100%', height: 54, borderRadius: 16, alignItems: 'center', paddingHorizontal: 20, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1E2022' },
  categoryScroll: { paddingHorizontal: 20, paddingVertical: 20 },
  categoryBtn: { backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, marginRight: 10, borderWidth: 1, borderColor: '#EFEFEF' },
  categoryBtnSelected: { backgroundColor: '#1E2022', borderColor: '#1E2022', shadowColor: '#1E2022', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 },
  categoryText: { fontSize: 13, color: '#6C757D', fontWeight: '600' },
  categoryTextSelected: { color: '#FFF', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E2022', marginHorizontal: 25, marginBottom: 15 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  card: { width: '46%', margin: '2%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 3, borderWidth: 1, borderColor: '#F1F1F5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
  cardImage: { width: '100%', height: 120, backgroundColor: '#F8F9FA' },
  cardBody: { padding: 12 },
  badgeRow: { flexDirection: 'row', marginBottom: 6 },
  cardCategory: { color: '#1E2022', fontSize: 10, fontWeight: 'bold', backgroundColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  cardTitle: { fontWeight: '700', fontSize: 14, color: '#1E2022' },
  cardCreator: { fontSize: 11, color: '#9A9FA5', marginTop: 4 }
});