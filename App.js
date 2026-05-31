// App.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Konfigurasi Firebase
import { auth, db } from './src/config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// 1. IMPORT SCREENS JALUR SISWA (Sesuai file barumu)
import LoginSiswaScreen from './src/screens/LoginSiswaScreen';
import RegisterSiswaScreen from './src/screens/RegisterSiswaScreen';
import HomeSiswaScreen from './src/screens/HomeSiswaScreen';
import AddProjectScreen from './src/screens/AddProjectScreen';
import ProfileSiswaScreen from './src/screens/ProfileSiswaScreen';

// 2. IMPORT SCREENS JALUR PUBLIK / UMUM (Sesuai file barumu)
import LoginPublikScreen from './src/screens/LoginPublikScreen';
import RegisterPublikScreen from './src/screens/RegisterPublikScreen';
import HomePublikScreen from './src/screens/HomePublikScreen';
import ProfilePublikScreen from './src/screens/ProfilePublikScreen';

// 3. IMPORT DETAIL SCREEN (Dipakai bersama saat kartu karya diklik)
import ProjectDetailScreen from './src/screens/ProjectDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ==========================================
// A. NAVIGASI MENU UTAMA KHUSUS JALUR SISWA
// ==========================================
function SiswaTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeSiswa') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'AddProject') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'ProfileSiswa') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E21921',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="HomeSiswa" component={HomeSiswaScreen} options={{ title: 'Beranda Siswa' }} />
      <Tab.Screen name="AddProject" component={AddProjectScreen} options={{ title: 'Upload' }} />
      <Tab.Screen name="ProfileSiswa" component={ProfileSiswaScreen} options={{ title: 'Profil Saya' }} />
    </Tab.Navigator>
  );
}

// ==========================================
// B. NAVIGASI MENU UTAMA KHUSUS JALUR PUBLIK
// ==========================================
function PublikTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomePublik') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'ProfilePublik') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="HomePublik" component={HomePublikScreen} options={{ title: 'Beranda' }} />
      <Tab.Screen name="ProfilePublik" component={ProfilePublikScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// ==========================================
// C. ENGINE UTAMA PENGATUR ALIRAN AKSES
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Mengambil role user ('siswa' atau 'publik') dari Firestore untuk penentuan rute
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().role) {
            setRole(userDoc.data().role);
          } else {
            setRole('publik'); // Cadangan aman jika role tidak ditemukan
          }
        } catch (error) {
          console.error("Gagal mendeteksi role di Firestore:", error);
          setRole('publik');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Menampilkan layar loading saat transisi pengecekan akun
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#E21921" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // --- JALUR AKSES SETELAH LOGIN SUKSES ---
          <>
            {role === 'siswa' ? (
              <Stack.Screen name="SiswaMain" component={SiswaTabs} />
            ) : (
              <Stack.Screen name="PublikMain" component={PublikTabs} />
            )}
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
          </>
        ) : (
          // --- JALUR AKSES SEBELUM LOGIN ---
          <>
            <Stack.Screen name="LoginSiswa" component={LoginSiswaScreen} />
            <Stack.Screen name="RegisterSiswa" component={RegisterSiswaScreen} />
            <Stack.Screen name="LoginPublik" component={LoginPublikScreen} />
            <Stack.Screen name="RegisterPublik" component={RegisterPublikScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}