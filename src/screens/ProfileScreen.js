// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function ProfileScreen({ navigation }) {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchMyProjects = async () => {
      if (!user) return;
      try {
        // Query murni mengambil karya milik user yang sedang login saja
        const q = query(
          collection(db, "projects"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMyProjects(list);
      } catch (error) {
        console.error("Error fetching my projects: ", error);
        // Fallback jika index Firestore belum siap
        try {
          const qFallback = query(collection(db, "projects"), orderBy("createdAt", "desc"));
          const snapshot = await getDocs(qFallback);
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMyProjects(list.filter(p => p.userId === user.uid));
        } catch (err) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [user]);

  // Fungsi Proses Logout (Aman untuk Mobile & Web Browser)
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const yakinWeb = window.confirm("Apakah kamu yakin ingin keluar dari akun Tel-Creation?");
      if (yakinWeb) {
        signOut(auth).catch(err => alert("Gagal logout: " + err.message));
      }
    } else {
      Alert.alert(
        "Keluar Akun",
        "Apakah kamu yakin ingin keluar dari aplikasi Tel-Creation?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Keluar", style: "destructive", onPress: () => signOut(auth) }
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#E21921" />
        <Text style={{ marginTop: 10, color: '#666' }}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER BACKGROUND MERAH MELENGKUNG */}
      <View style={styles.profileHeader}>
        <Text style={styles.headerTitle}>Profil Siswa</Text>
        <TouchableOpacity style={styles.btnLogout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* USER CARD INFO (Menempel Naik ke Atas) */}
      <View style={styles.infoCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.displayName || 'Nama Siswa'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'siswa@smktelkom.sch.id'}</Text>
        <View style={styles.badgeSiswa}>
          <Text style={styles.badgeText}>Siswa SMK Telkom</Text>
        </View>
      </View>

      {/* REKAP JUMLAH KARYA */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{myProjects.length}</Text>
          <Text style={styles.statLabel}>Total Karya Dirilis</Text>
        </View>
      </View>

      {/* DAFTAR KARYA SAYA (PORTFOLIO GRID 2 KOLOM) */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Karya Saya</Text>
      </View>

      {myProjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-upload-outline" size={44} color="#CCC" />
          <Text style={styles.emptyText}>Kamu belum merilis karya</Text>
          <Text style={styles.emptySubtext}>Karya digital atau portofolio yang kamu unggah akan tersusun rapi di sini.</Text>
        </View>
      ) : (
        <View style={styles.gridContainer}>
          {myProjects.map((proj) => {
            const hasImage = proj.image && proj.image.trim() !== '' && proj.image !== 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400';
            
            return (
              <TouchableOpacity 
                key={proj.id} 
                style={styles.projectCard}
                onPress={() => navigation.navigate('ProjectDetail', { project: proj })}
              >
                {hasImage ? (
                  <Image source={{ uri: proj.image }} style={styles.cardImage} />
                ) : (
                  <View style={styles.noImagePlaceholder}>
                    <Ionicons name="image-outline" size={20} color="#AAA" />
                    <Text style={styles.noImageText}>No Image</Text>
                  </View>
                )}
                <View style={styles.cardBody}>
                  <Text style={styles.cardCategory}>{proj.category || 'Umum'}</Text>
                  <Text style={styles.cardTitle} numberOfLines={1}>{proj.title}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  center: { justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  profileHeader: {
    backgroundColor: '#E21921',
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 60,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  btnLogout: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },
  infoCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: -40,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  avatarLarge: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#FFEBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E21921',
  },
  avatarText: { color: '#E21921', fontSize: 28, fontWeight: 'bold' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 13, color: '#777', marginTop: 3 },
  badgeSiswa: {
    backgroundColor: '#E21921',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 15,
  },
  statBox: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#E21921' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 2 },
  sectionTitleContainer: { marginHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  projectCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardImage: { width: '100%', height: 100, resizeMode: 'cover' },
  noImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: { fontSize: 10, color: '#AAA', marginTop: 4 },
  cardBody: { padding: 10 },
  cardCategory: { color: '#E21921', fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
  cardTitle: { fontWeight: 'bold', fontSize: 12, color: '#333' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EEE',
    borderStyle: 'dashed',
  },
  emptyText: { fontWeight: 'bold', fontSize: 14, color: '#555', marginTop: 10 },
  emptySubtext: { fontSize: 11, color: '#888', textAlign: 'center', paddingHorizontal: 30, marginTop: 4, lineHeight: 16 },
});