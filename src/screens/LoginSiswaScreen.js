import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginSiswaScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Email dan Password wajib diisi!');
      return;
    }
    if (!email.endsWith('@student.smktelkom-pwt.sch.id')) {
      alert('Login Siswa wajib menggunakan email @student.smktelkom-pwt.sch.id!');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Siswa Berhasil!');
    } catch (error) {
      console.error(error);
      alert('Email atau Password salah!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Portal Siswa</Text>
      <Text style={styles.subtitle}>Masuk untuk mengunggah dan mengelola karya digitalmu</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email Siswa</Text>
        <TextInput 
          style={styles.input} 
          placeholder="username@student.smktelkom-pwt.sch.id" 
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Masukkan password" 
          secureTextEntry 
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btnRed} onPress={handleLogin} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Memverifikasi Siswa...' : 'Masuk Sebagai Siswa'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSwitch} onPress={() => navigation.navigate('LoginPublik')}>
          <Text style={styles.btnSwitchText}>Bukan Siswa? Masuk Jalur Umum / Publik</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Belum punya akun siswa? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('RegisterSiswa')}>
            <Text style={styles.linkText}>Daftar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E21921', marginTop: 60 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5, marginBottom: 40 },
  form: { marginTop: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 15, height: 48, fontSize: 14, marginBottom: 20, backgroundColor: '#FAFAFA' },
  btnRed: { backgroundColor: '#E21921', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  btnSwitch: { borderWidth: 1, borderColor: '#E21921', height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  btnSwitchText: { color: '#E21921', fontSize: 14, fontWeight: '600' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  footerText: { color: '#777', fontSize: 14 },
  linkText: { color: '#E21921', fontSize: 14, fontWeight: 'bold' }
});