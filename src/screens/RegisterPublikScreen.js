import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterPublikScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name,
        email,
        role: 'publik',
        createdAt: new Date().toISOString()
      });

      alert('Registrasi Akun Umum Berhasil!');
      navigation.navigate('LoginPublik');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Daftar Akun Umum</Text>
      <Text style={styles.subtitle}>Gabung untuk mengapresiasi portofolio digital SMK Telkom</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} placeholder="Masukkan nama lengkap" value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan email aktif kamu" 
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Minimal 6 karakter" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.btnRed} onPress={handleRegister} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Memproses...' : 'Daftar Akun Umum'}</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginPublik')}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginTop: 40 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5, marginBottom: 25 },
  form: { marginTop: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 14, marginBottom: 16, backgroundColor: '#FAFAFA' },
  btnRed: { backgroundColor: '#333', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#777', fontSize: 14 },
  linkText: { color: '#E21921', fontSize: 14, fontWeight: 'bold' }
});