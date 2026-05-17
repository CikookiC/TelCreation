// src/screens/AddProjectScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddProjectScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('Cover Buku');

  const categoriesList = [
    'Cover Buku',
    'Poster',
    'UI/UX Design',
    'Logo / Branding',
    'Banner / Pamflet',
    'Ilustrasi 2D/3D',
    'Web Development',
    'Game Development',
    'IoT / Robotics'
  ];

  const handleUpload = async () => {
    // SEKARANG JUDUL, DESKRIPSI, DAN LINK PROYEK BERSIFAT WAJIB!
    if (!title || !description || !link) {
      alert('Judul, Deskripsi, dan Tautan Proyek wajib diisi!');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const creatorName = user?.displayName || user?.email?.split('@')[0] || 'Siswa SMK Telkom';

      await addDoc(collection(db, "projects"), {
        title: title,
        category: category,
        description: description,
        link: link, // Wajib diisi
        // Gambar jadi opsional, kalau kosong otomatis pakai gambar default Unsplash
        image: imageUrl.trim() !== '' ? imageUrl : 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400', 
        creator: creatorName,
        userId: user?.uid,
        createdAt: serverTimestamp()
      });

      alert('Karya berhasil di-upload ke Tel-Creation!');
      
      // Reset Form
      setTitle('');
      setDescription('');
      setLink('');
      setImageUrl('');
      setCategory('Cover Buku');

      if (navigation) {
        navigation.navigate('Beranda');
      }
    } catch (error) {
      console.error("Gagal mengupload karya: ", error);
      alert('Terjadi kesalahan saat mengunggah karya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Karya Baru</Text>
        <Text style={styles.headerSubtitle}>Pamerkan hasil kreativitas dan portofolio digital terbaikmu.</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Judul Karya</Text>
        <TextInput 
          placeholder="Contoh: Desain Cover Novel Fantasi" 
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Pilih Jenis Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categoriesList.map((item) => {
            const isSelected = category === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.categoryBadge, isSelected && styles.categoryBadgeSelected]}
                onPress={() => setCategory(item)}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* LINK PROYEK SEKARANG BERSIFAT WAJIB */}
        <Text style={styles.label}>Tautan Proyek / Demo Eksternal</Text>
        <TextInput 
          placeholder="https://github.com/... atau https://figma.com/..." 
          style={styles.input}
          value={link}
          onChangeText={setLink}
        />

        {/* LINK GAMBAR SEKARANG BERSIFAT OPSIONAL */}
        <Text style={styles.label}>Tautan Gambar Karya / URL (Opsional)</Text>
        <TextInput 
          placeholder="https://example.com/gambar-karyamu.jpg (Kosongkan jika tidak ada)" 
          style={styles.input}
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        <Text style={styles.label}>Deskripsi Singkat Karya</Text>
        <TextInput 
          placeholder="Ceritakan latar belakang karya, konsep desain, atau teknologi/tools apa yang kamu gunakan..." 
          style={[styles.input, styles.textArea]}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.btnSubmit} onPress={handleUpload} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>Publish Karya Sekarang</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { backgroundColor: '#E21921', padding: 25, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 12, color: 'white', opacity: 0.8, marginTop: 4, lineHeight: 18 },
  form: { padding: 20, marginTop: 10 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 15 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 12, paddingHorizontal: 15, height: 48, fontSize: 13, color: '#000', backgroundColor: '#FAFAFA' },
  textArea: { height: 100, paddingTop: 12, paddingBottom: 12 },
  categoryScroll: { flexDirection: 'row', marginBottom: 5, paddingVertical: 5 },
  categoryBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#EAEAEA' },
  categoryBadgeSelected: { backgroundColor: '#E21921', borderColor: '#E21921' },
  categoryText: { fontSize: 12, color: '#666', fontWeight: '500' },
  categoryTextSelected: { color: 'white', fontWeight: 'bold' },
  btnSubmit: { backgroundColor: '#E21921', height: 50, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, elevation: 3, shadowColor: '#E21921', shadowOpacity: 0.2, shadowRadius: 5 },
  btnText: { color: 'white', fontSize: 14, fontWeight: 'bold' }
});