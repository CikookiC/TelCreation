// src/screens/ProjectDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectDetailScreen({ route, navigation }) {
  // Ambil data project yang dikirimkan dari halaman Beranda
  const { project } = route.params;

  // Cek apakah ada gambar atau tidak
  const hasImage = project.image && project.image.trim() !== '' && project.image !== 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400';

  // Fungsi untuk membuka Link Eksternal (Figma, GitHub, dll)
  const openProjectLink = () => {
    if (project.link) {
      Linking.openURL(project.link).catch((err) => alert("Gagal membuka tautan: " + err));
    } else {
      alert("Tautan proyek tidak tersedia.");
    }
  };

  // Fungsi untuk fitur Share/Bagikan Karya
  const onShare = async () => {
    try {
      await Share.share({
        message: `Lihat karya luar biasa "${project.title}" oleh ${project.creator} di Tel-Creation!`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* CUSTOM HEADER DENGAN TOMBOL BACK & SHARE */}
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare} style={styles.headerBtn}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* IMAGE SECTION */}
        {hasImage ? (
          <Image source={{ uri: project.image }} style={styles.projectImage} />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Ionicons name="image-outline" size={60} color="#CCC" />
            <Text style={styles.noImageText}>Gambar tidak tersedia</Text>
          </View>
        )}

        {/* CONTENT SECTION */}
        <View style={styles.contentCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{project.category || 'Umum'}</Text>
          </View>

          <Text style={styles.titleText}>{project.title}</Text>
          
          <View style={styles.creatorRow}>
            <View style={styles.avatarMini}>
              <Text style={styles.avatarInitial}>{project.creator ? project.creator.charAt(0).toUpperCase() : 'S'}</Text>
            </View>
            <View>
              <Text style={styles.creatorLabel}>Dibuat oleh</Text>
              <Text style={styles.creatorName}>{project.creator}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* DESKRIPSI SECTION */}
          <Text style={styles.sectionTitle}>Deskripsi Proyek</Text>
          <Text style={styles.descriptionText}>
            {project.description || "Tidak ada deskripsi tambahan untuk karya ini."}
          </Text>
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON (BUKA TAUTAN) */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.btnAction} onPress={openProjectLink}>
          <Ionicons name="logo-github" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.btnActionText}>Buka Tautan Proyek</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'white',
    zIndex: 10,
  },
  headerBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  projectImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  noImagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 10,
    color: '#999',
    fontWeight: '500',
  },
  contentCard: {
    backgroundColor: 'white',
    marginTop: -20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    minHeight: 400,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFEBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 15,
  },
  categoryText: {
    color: '#E21921',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 32,
    marginBottom: 20,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarMini: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E21921',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  creatorLabel: {
    fontSize: 11,
    color: '#999',
  },
  creatorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    width: '100%',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
    textAlign: 'justify',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 35, // Agar aman di layar HP modern
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  btnAction: {
    backgroundColor: '#E21921',
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#E21921',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  btnActionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});