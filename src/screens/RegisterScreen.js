// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen({ navigation }) {
  const [role, setRole] = useState('siswa'); // 'siswa' atau 'publik'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nis, setNis] = useState('');
  const [kelas, setKelas] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validasi dasar
    if (!name || !email || !password) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    // Validasi Khusus Siswa
    if (role === 'siswa') {
      if (!nis || !kelas) {
        alert('NIS dan Kelas wajib diisi untuk Siswa!');
        return;
      }
      if (!email.endsWith('@student.smktelkom-pwt.sch.id')) {
        alert('Email siswa harus menggunakan domain @student.smktelkom-pwt.sch.id');
        return;
      }
    }

    setLoading(false);
    try {
      setLoading(true);
      // 1. Buat user di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Siapkan data untuk disimpan di Firestore
      const userData = {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString()
      };

      if (role === 'siswa') {
        userData.nis = nis;
        userData.kelas = kelas;
      }

      // 3. Simpan ke collection 'users'
      await setDoc(doc(db, 'users', user.uid), userData);

      alert('Registrasi Berhasil!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Daftar Akun</Text>
      <Text style={styles.subtitle}>Mulai bagikan karya terbaikmu di Tel-Creation</Text>

      {/* PILIHAN ROLE */}
      <View style={styles.roleContainer}>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'siswa' && styles.roleActive]} 
          onPress={() => setRole('siswa')}
        >
          <Text style={[styles.roleText, role === 'siswa' && styles.textActive]}>Siswa Telkom</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.roleButton, role === 'publik' && styles.roleActive]} 
          onPress={() => setRole('publik')}
        >
          <Text style={[styles.roleText, role === 'publik' && styles.textActive]}>Publik / Umum</Text>
        </TouchableOpacity>
      </View>

      {/* INPUT FIELDS */}
      <View style={styles.form}>
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput style={styles.input} placeholder="Masukkan nama lengkap" value={name} onChangeText={setName} />

        {role === 'siswa' && (
          <>
            <Text style={styles.label}>NIS</Text>
            <TextInput style={styles.input} placeholder="Masukkan NIS" keyboardType="numeric" value={nis} onChangeText={setNis} />

            <Text style={styles.label}>Kelas</Text>
            <TextInput style={styles.input} placeholder="Contoh: XI PPLG 1" value={kelas} onChangeText={setKelas} />
          </>
        )}

        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder={role === 'siswa' ? "username@student.smktelkom-pwt.sch.id" : "Masukkan email bebas"} 
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput style={styles.input} placeholder="Minimal 6 karakter" secureTextEntry autoCapitalize="none" value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.btnRed} onPress={handleRegister} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Memproses...' : 'Daftar Sekarang'}</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E21921', marginTop: 40 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5, marginBottom: 25 },
  roleContainer: { flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 10, padding: 4, marginBottom: 20 },
  roleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  roleActive: { backgroundColor: '#E21921' },
  roleText: { fontSize: 14, fontWeight: '600', color: '#555' },
  textActive: { color: '#FFF' },
  form: { marginTop: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 14, marginBottom: 16, backgroundColor: '#FAFAFA' },
  btnRed: { backgroundColor: '#E21921', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#777', fontSize: 14 },
  linkText: { color: '#E21921', fontSize: 14, fontWeight: 'bold' }
});