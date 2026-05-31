// src/screens/ProfileSiswaScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, Platform } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileSiswaScreen({ navigation }) {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLink, setEditLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const q = query(collection(db, "projects"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyProjects(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsubscribe();
  }, [user]);

  const handleOpenEdit = (project) => {
    setSelectedProjectId(project.id); setEditTitle(project.title); setEditCategory(project.category || '');
    setEditDescription(project.description || ''); setEditLink(project.link || ''); setIsEditModalOpen(true);
  };

  const handleUpdateProject = async () => {
    if (!editTitle.trim()) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "projects", selectedProjectId), { title: editTitle, category: editCategory, description: editDescription, link: editLink, updatedAt: new Date().toISOString() });
      setIsEditModalOpen(false); alert("Eksperimen karya berhasil diperbarui!");
    } catch (e) { alert(e.message); } finally { setIsSaving(false); }
  };

  const handleDeleteProject = (projectId) => {
    const runDelete = async () => {
      try { await deleteDoc(doc(db, "projects", projectId)); alert("Karya resmi diarsipkan keluar sistem."); } catch (e) { alert(e.message); }
    };
    if (Platform.OS === 'web') {
      if (window.confirm("Hapus portofolio ini secara permanen?")) runDelete();
    } else {
      Alert.alert("Konfirmasi", "Hapus permanen karya ini?", [{ text: "Batal" }, { text: "Hapus", onPress: runDelete }]);
    }
  };

  if (loading) { return <View style={styles.center}><ActivityIndicator size="large" color="#E21921" /></View>; }

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFC' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kreator Dashboard</Text>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => signOut(auth)}>
            <Ionicons name="log-out-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.avatarGlow}><Text style={styles.avatarText}>{user?.email?.charAt(0).toUpperCase()}</Text></View>
          <Text style={styles.name}>{user?.displayName || 'Siswa SMK Telkom'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={styles.statContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{myProjects.length}</Text>
              <Text style={styles.statLabel}>Total Karya</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Portofolio Saya</Text>
        {myProjects.length === 0 ? (
          <Text style={styles.emptyText}>Mulai dengan mempublikasikan karya pertamamu!</Text>
        ) : (
          <View style={styles.grid}>
            {myProjects.map((p) => (
              <View key={p.id} style={styles.card}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ProjectDetail', { project: p })}>
                  <Image source={{ uri: p.image }} style={styles.cardImg} />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardCategory}>{p.category || 'UI/UX'}</Text>
                    <Text style={styles.cardTitle} numberOfLines={1}>{p.title}</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtnEdit} onPress={() => handleOpenEdit(p)}>
                    <Ionicons name="create-outline" size={15} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtnDelete} onPress={() => handleDeleteProject(p.id)}>
                    <Ionicons name="trash-outline" size={15} color="#E21921" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={isEditModalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ubah Manuskrip Karya</Text>
            <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} placeholder="Judul Proyek" />
            <TextInput style={[styles.input, { marginTop: 10 }]} value={editCategory} onChangeText={setEditCategory} placeholder="Kategori" />
            <TextInput style={[styles.input, { marginTop: 10 }]} value={editLink} onChangeText={setEditLink} placeholder="Tautan" />
            <TextInput style={[styles.input, styles.textArea, { marginTop: 10 }]} value={editDescription} onChangeText={setEditDescription} placeholder="Deskripsi" multiline numberOfLines={3} />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={[styles.modalBtn, styles.btnCancel]} onPress={() => setIsEditModalOpen(false)}><Text style={{ color: '#495057', fontWeight: 'bold' }}>Batal</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.btnSave]} onPress={handleUpdateProject}><Text style={{ color: '#FFF', fontWeight: 'bold' }}>Simpan</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#E21921', padding: 25, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '800' },
  logoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
  infoCard: { backgroundColor: '#FFF', margin: 20, padding: 25, borderRadius: 24, alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  avatarGlow: { width: 64, height: 64, borderRadius: 22, backgroundColor: '#FFEBEB', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#E21921' },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#E21921' },
  name: { fontSize: 18, fontWeight: '800', color: '#1A1D20' },
  email: { color: '#6C757D', marginTop: 2, fontSize: 13 },
  statContainer: { marginTop: 15, borderTopWidth: 1, borderColor: '#F1F1F5', width: '100%', paddingTop: 15, alignItems: 'center' },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '900', color: '#E21921' },
  statLabel: { fontSize: 11, color: '#9A9FA5', fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
  sectionTitle: { marginHorizontal: 25, fontWeight: '800', fontSize: 16, color: '#1A1D20', marginBottom: 10 },
  emptyText: { textAlign: 'center', color: '#999', padding: 30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15 },
  card: { width: '46%', margin: '2%', backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 2, borderWidth: 1, borderColor: '#F1F1F5' },
  cardImg: { width: '100%', height: 110, backgroundColor: '#F8F9FA' },
  cardBody: { padding: 10 },
  cardCategory: { color: '#E21921', fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
  cardTitle: { fontWeight: '700', fontSize: 13, color: '#2D3142' },
  actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F8F9FA', height: 40 },
  actionBtnEdit: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#F8F9FA' },
  actionBtnDelete: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 25 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20, color: '#1A1D20' },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#EFEFEF', borderRadius: 12, padding: 12, fontSize: 14 },
  textArea: { height: 80, textAlignVertical: 'top' },
  modalBtnRow: { flexDirection: 'row', marginTop: 20 },
  modalBtn: { flex: 1, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  btnCancel: { backgroundColor: '#F1F3F5' },
  btnSave: { backgroundColor: '#E21921' }
});