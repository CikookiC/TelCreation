// App.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from './src/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Import Semua Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddProjectScreen from './src/screens/AddProjectScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProjectDetailScreen from './src/screens/ProjectDetailScreen'; // Import Detail Screen baru

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 1. DASHBOARD KHUSUS SISWA (Ada Menu Upload)
function SiswaTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E21921',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Beranda') iconName = 'home-outline';
          else if (route.name === 'Upload') iconName = 'add-circle-outline';
          else if (route.name === 'Profil') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Upload" component={AddProjectScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 2. DASHBOARD KHUSUS PUBLIK (Menu Upload Dihilangkan)
function PublikTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E21921',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE' },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Beranda') iconName = 'home-outline';
          else if (route.name === 'Profil') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 3. LOGIKA UTAMA APLIKASI
export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'siswa' atau 'publik'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          // Tarik data role langsung dari Firestore setelah user terdeteksi login
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole('publik'); // Fallback aman
          }
        } catch (error) {
          console.error("Gagal mengambil role saat login: ", error);
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
        {user && role ? (
          <>
            {/* Jika sudah login, arahkan ke jenis Tab Navigator berdasarkan Role-nya */}
            <Stack.Screen name="Main">
              {() => role === 'siswa' ? <SiswaTabs /> : <PublikTabs />}
            </Stack.Screen>
            
            {/* Halaman Detail ditaruh di sini agar bisa dibuka secara universal */}
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
          </>
        ) : (
          // Jika belum login, tampilkan alur Autentikasi dasar
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}