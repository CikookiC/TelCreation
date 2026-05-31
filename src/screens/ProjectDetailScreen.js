// src/screens/ProjectDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProjectDetailScreen({ route, navigation }) {
  const { project } = route.params;
  const user = auth.currentUser;

  // Deteksi Peran Dinamis (Siswa vs Publik)
  const isSiswa = user?.email ? (user.email.endsWith('@student.telkom.sch.id') || user.email.includes('siswa')) : false;
  
  const themeColor = isSiswa ? '#E21921' : '#1E2022';
  const badgeBg = isSiswa ? '#FFF0F0' : '#F0F2F5';

  const handleOpenLink = () => {
    if (project.link) {
      Linking.openURL(project.link).catch(() => alert('Gagal membuka tautan proyek.'));
    } else {
      alert('Kreator tidak menyertakan tautan demo untuk proyek ini.');
    }
  };

  // Fungsi simulasi share (bisa dikembangkan nanti)
  const handleShare = () => {
    alert('Tautan proyek berhasil disalin!');
  };

  return (
    <View style={styles.container}>
      {/* Tombol Aksi Melayang di Atas Gambar (Floating Header Buttons) */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconCircleButton}>
          <Ionicons name="arrow-back" size={22} color="#1A1D20" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.iconCircleButton}>
          <Ionicons name="share-social-outline" size={22} color="#1A1D20" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Hero / Gambar Utama */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: project.image || 'https://via.placeholder.com/800x450.png?text=Telkom+Creation' }} 
            style={styles.projectImage} 
            resizeMode="cover" 
          />
        </View>

        {/* Konten Informasi Utama */}
        <View style={styles.bodyContainer}>
          <View style={styles.bodyCard}>
            {/* Tag Kategori */}
            <View style={styles.badgeRow}>
              <Text style={[styles.categoryBadge, { color: themeColor, backgroundColor: badgeBg }]}>
                {project.category || 'Desain'}
              </Text>
            </View>

            {/* Judul Proyek */}
            <Text style={styles.projectTitle}>{project.title || 'Untitled Project'}</Text>
            
            {/* Kartu Profil Kreator */}
            <View style={styles.creatorCard}>
              <View style={[styles.avatarCircle, { backgroundColor: themeColor }]}>
                <Text style={styles.avatarText}>
                  {project.creator ? project.creator.charAt(0).toUpperCase() : 'K'}
                </Text>
              </View>
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorLabel}>Dibuat oleh</Text>
                <Text style={styles.creatorName}>{project.creator || 'Siswa SMK Telkom'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Sub-Seksi Deskripsi */}
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="document-text-outline" size={18} color={themeColor} style={{ marginRight: 6 }} />
              <Text style={styles.sectionLabel}>Deskripsi Proyek</Text>
            </View>
            
            <Text style={styles.descriptionText}>
              {project.description || 'Ini adalah portofolio karya digital kreatif yang dikembangkan oleh siswa SMK Telkom.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar & Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: themeColor, shadowColor: themeColor }]} 
          onPress={handleOpenLink}
        >
          <Ionicons name="rocket-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Buka Tautan Proyek</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // Floating Action Header
  floatingHeader: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  iconCircleButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  
  scrollContent: { paddingBottom: 120 },
  
  // Image Hero Section
  imageContainer: { width: '100%', backgroundColor: '#EFEFEF', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  projectImage: { width: '100%', height: width > 600 ? 380 : 250 }, // Menyesuaikan jika dibuka di device lebar/tablet
  
  // Content Wrapper
  bodyContainer: { paddingHorizontal: 20, marginTop: -20 },
  bodyCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#F1F1F5', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 15, elevation: 2 },
  
  // Badges & Titles
  badgeRow: { flexDirection: 'row', marginBottom: 12 },
  categoryBadge: { fontSize: 11, fontWeight: '800', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, textTransform: 'uppercase', letterSpacing: 0.6 },
  projectTitle: { fontSize: 24, fontWeight: '900', color: '#1A1D20', lineHeight: 32, marginBottom: 16 },
  
  // Creator Info Card
  creatorCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#EFEFEF' },
  avatarCircle: { width: 40, height: 40, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  creatorInfo: { marginLeft: 12 },
  creatorLabel: { fontSize: 11, color: '#9A9FA5', fontWeight: '500' },
  creatorName: { fontSize: 14, fontWeight: '700', color: '#2D3142', marginTop: 1 },
  
  divider: { height: 1, backgroundColor: '#F1F1F5', marginVertical: 20 },
  
  // Sections Description
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { fontSize: 14, fontWeight: '800', color: '#1A1D20' },
  descriptionText: { fontSize: 14, color: '#4A545E', lineHeight: 24, fontWeight: '400', marginTop: 8 },
  
  // Bottom Sticky Component
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 18, borderTopWidth: 1, borderTopColor: '#F1F1F5', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 10 },
  actionButton: { height: 50, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  actionButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, letterSpacing: 0.3 }
});