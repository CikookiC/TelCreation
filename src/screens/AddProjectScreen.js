// src/screens/AddProjectScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function AddProjectScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Game'); 
  const [loading, setLoading] = useState(false);

  const categories = ['Game', 'Website', 'Aplikasi', 'Desain', 'UI/UX', 'videografi', 'fotografi'];

  const handleUploadProject = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Judul dan Deskripsi wajib dilengkapi!');
      return;
    }
    const user = auth.currentUser;
    if (!user) { alert('Sesi berakhir, silakan login ulang!'); return; }

    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        title, link: projectLink, image: imageUrl || 'https://via.placeholder.com/400x250.png?text=Telkom+Creation',
        description, category, userId: user.uid, creator: user.displayName || 'Kreator Telkom', createdAt: new Date().toISOString(),
      });
      alert('Selamat! Karyamu resmi meluncur ke etalase.');
      setTitle(''); setProjectLink(''); setImageUrl(''); setDescription(''); setCategory('Game');
      navigation.navigate('HomeSiswa');
    } catch (e) {
      alert(e.message);
    } finally { setLoading(false); }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Publikasikan Karya</Text>
      <View style={styles.formCard}>
        <Text style={styles.label}>Judul Proyek</Text>
        <TextInput style={styles.input} placeholder="E.g., Virtual Reality Edu-Sains" value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Pilih Sektor Kategori</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity key={cat} style={[styles.badge, isSelected && styles.badgeSelected]} onPress={() => setCategory(cat)}>
                <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Tautan Repositori / Demo</Text>
        <TextInput style={styles.input} placeholder="https://github.com/..." value={projectLink} onChangeText={setProjectLink} autoCapitalize="none" />

        <Text style={styles.label}>Tautan Gambar Mockup</Text>
        <TextInput style={styles.input} placeholder="https://unsplash.com/..." value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" />

        <Text style={styles.label}>Abstrak & Spesifikasi Teknologi</Text>
        <TextInput style={[styles.input, styles.textArea]} placeholder="Gunakan teknologi framework apa saja..." value={description} onChangeText={setDescription} multiline numberOfLines={5} />

        <TouchableOpacity style={styles.btnSubmit} onPress={handleUploadProject} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Luncurkan Karya Sekarang</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#1A1D20', marginTop: 60, marginHorizontal: 25, marginBottom: 5 },
  formCard: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EFEFEF', elevation: 2 },
  label: { fontSize: 13, fontWeight: '700', color: '#2D3142', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#333', borderWidth: 1, borderColor: '#EFEFEF' },
  textArea: { height: 110, textAlignVertical: 'top' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  badge: { backgroundColor: '#F1F3F5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  badgeSelected: { backgroundColor: '#E21921' },
  badgeText: { fontSize: 12, color: '#495057', fontWeight: '600' },
  badgeTextSelected: { color: '#FFF', fontWeight: 'bold' },
  btnSubmit: { backgroundColor: '#E21921', height: 52, borderRadius: 16, justifyContent: 'center', itemsAlign: 'center', marginTop: 30, shadowColor: '#E21921', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});