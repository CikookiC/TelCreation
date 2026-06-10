// src/screens/AddProjectScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { db, auth } from '../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function AddProjectScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [creatorName, setCreatorName] = useState(''); // State untuk nama penerbit
  const [nis, setNis] = useState('');                 // State untuk NIS
  const [projectLink, setProjectLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Game'); 
  const [loading, setLoading] = useState(false);

  const categories = ['Game', 'Website', 'Aplikasi', 'Desain', 'UI/UX', 'videografi', 'fotografi'];

  const handleUploadProject = async () => {
    // Validasi input wajib termasuk Nama dan NIS
    if (!title.trim() || !creatorName.trim() || !nis.trim() || !description.trim()) {
      alert('Judul, Nama, NIS, dan Deskripsi wajib dilengkapi!');
      return;
    }
    const user = auth.currentUser;
    if (!user) { 
      alert('Sesi berakhir, silakan login ulang!'); 
      return; 
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        title, 
        creator: creatorName, // Menyimpan nama siswa yang diinput secara dinamis
        nis,                  // Menyimpan NIS yang diinput secara dinamis
        link: projectLink, 
        image: imageUrl || 'https://via.placeholder.com/400x250.png?text=Telkom+Creation',
        description, 
        category, 
        userId: user.uid, 
        createdAt: new Date().toISOString(),
      });
      alert('Selamat! Karyamu resmi meluncur ke etalase.');
      
      // Reset Form kembali kosong setelah upload berhasil
      setTitle(''); setCreatorName(''); setNis(''); setProjectLink(''); setImageUrl(''); setDescription(''); setCategory('Game');
      navigation.navigate('HomeSiswa');
    } catch (e) {
      alert(e.message);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Judul Halaman */}
      <Text style={styles.pageTitle}>Rilis Karya Baru</Text>
      
      <View style={styles.formCard}>
        {/* Input Judul */}
        <Text style={styles.label}>Judul Proyek</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Nama aplikasi / game / desain" 
          value={title} 
          onChangeText={setTitle} 
        />

        {/* Pemilihan Kategori */}
        <Text style={styles.label}>Pilih Sektor Kategori</Text>
        <View style={styles.categoryContainer}>
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity 
                key={cat} 
                style={[styles.badge, isSelected && styles.badgeSelected]} 
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Input Nama Lengkap */}
        <Text style={styles.label}>Nama Lengkap Siswa</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan nama lengkapmu" 
          value={creatorName} 
          onChangeText={setCreatorName} 
        />

        {/* Input NIS */}
        <Text style={styles.label}>Nomor Induk Siswa (NIS)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan NIS aktif" 
          value={nis} 
          onChangeText={setNis} 
          keyboardType="numeric"
        />

        {/* Input Tautan Link */}
        <Text style={styles.label}>Link Karya</Text>
        <TextInput 
          style={styles.input} 
          placeholder="https://..." 
          value={projectLink} 
          onChangeText={setProjectLink} 
          autoCapitalize="none" 
        />

        {/* Input Gambar Sampul */}
        <Text style={styles.label}>URL Gambar Sampul (Opsional)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="https://..." 
          value={imageUrl} 
          onChangeText={setImageUrl} 
          autoCapitalize="none" 
        />

        {/* Input Deskripsi Singkat */}
        <Text style={styles.label}>Deskripsi Singkat</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Jelaskan fitur atau teknologi yang kamu pakai..." 
          value={description} 
          onChangeText={setDescription} 
          multiline 
          numberOfLines={5} 
        />

        {/* Tombol Aksi Submit */}
        <TouchableOpacity style={styles.btnSubmit} onPress={handleUploadProject} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.btnText}>Sebarkan Karya Sekarang</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFC' },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#E21921', marginTop: 60, marginHorizontal: 25, marginBottom: 5 },
  formCard: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#EFEFEF', elevation: 2 },
  label: { fontSize: 13, fontWeight: '700', color: '#2D3142', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#333', borderWidth: 1, borderColor: '#EFEFEF' },
  textArea: { height: 110, textAlignVertical: 'top' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
  badge: { backgroundColor: '#F1F3F5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  badgeSelected: { backgroundColor: '#E21921' },
  badgeText: { fontSize: 12, color: '#495057', fontWeight: '600' },
  badgeTextSelected: { color: '#FFF', fontWeight: 'bold' },
  btnSubmit: { backgroundColor: '#E21921', height: 52, borderRadius: 16, justifyContent: 'center', marginTop: 30, shadowColor: '#E21921', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});