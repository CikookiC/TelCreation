// src/screens/HomeSiswaScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function HomeSiswaScreen({ navigation }) {
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
    return <View style={styles.center}><ActivityIndicator size="large" color="#E21921" /></View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Jumbotron Merah */}
      <View style={styles.jumbotron}>
        <Text style={styles.tagline}>Kreativitas Tanpa Batas</Text>
        <Text style={styles.jumbotronTitle}>Tel-Creation Hub</Text>
        <Text style={styles.jumbotronSubtitle}>Etalase karya digital inovatif talenta muda SMK Telkom.</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#E21921" style={{ marginRight: 10 }} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Cari maha karya digital..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#A0A0A0"
          />
        </View>
      </View>

      {/* Filter Kategori - Aktif Merah */}
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

      <Text style={styles.sectionTitle}>Eksplorasi Karya Terbaik</Text>
      {filteredProjects.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada inovasi di kategori ini.</Text>
      ) : (
        <View style={styles.grid}>
          {filteredProjects.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => navigation.navigate('ProjectDetail', { project: item })}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <View style={styles.badgeRow}><Text style={styles.cardCategory}>{item.category || 'Game'}</Text></View>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardCreator}>By {item.creator}</Text>
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
  jumbotron: { backgroundColor: '#E21921', padding: 30, paddingTop: 70, paddingBottom: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, shadowColor: '#E21921', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  tagline: { color: '#FFEBEB', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  jumbotronTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  jumbotronSubtitle: { color: '#FEEAEA', fontSize: 13, marginTop: 6, lineHeight: 20, opacity: 0.9 },
  searchSection: { marginTop: -25, alignItems: 'center', paddingHorizontal: 25 },
  searchBar: { flexDirection: 'row', backgroundColor: '#FFF', width: '100%', height: 54, borderRadius: 16, alignItems: 'center', paddingHorizontal: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#2D3142', fontWeight: '500' },
  categoryScroll: { paddingHorizontal: 20, paddingVertical: 20 },
  categoryBtn: { backgroundColor: '#FFF', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 14, marginRight: 10, borderWidth: 1, borderColor: '#EFEFEF', elevation: 1 },
  categoryBtnSelected: { backgroundColor: '#E21921', borderColor: '#E21921', shadowColor: '#E21921', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  categoryText: { fontSize: 13, color: '#6C757D', fontWeight: '600' },
  categoryTextSelected: { color: '#FFF', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1A1D20', marginHorizontal: 25, marginBottom: 15, letterSpacing: -0.3 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  card: { width: '46%', margin: '2%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: '#F1F1F5' },
  cardImage: { width: '100%', height: 120, backgroundColor: '#F8F9FA' },
  cardBody: { padding: 12 },
  badgeRow: { flexDirection: 'row', marginBottom: 6 },
  cardCategory: { color: '#E21921', fontSize: 10, fontWeight: 'bold', backgroundColor: '#FFF0F0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, textTransform: 'uppercase' },
  cardTitle: { fontWeight: '700', fontSize: 14, color: '#2D3142' },
  cardCreator: { fontSize: 11, color: '#9A9FA5', marginTop: 4, fontWeight: '500' }
});