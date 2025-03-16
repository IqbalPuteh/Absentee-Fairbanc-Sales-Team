import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RegistrationScreen from "./components/RegistrationScreen";
import MainMenu from "./components/MainMenu";

const USER_DATA_KEY = "@attendance_app_user_data";

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);
  const [userData, setUserData] = useState<{
    phoneNumber: string;
    name: string;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    // Check if user is registered by retrieving data from AsyncStorage
    const checkUserRegistration = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === "granted");

        // Get user data from AsyncStorage
        const storedUserDataString = await AsyncStorage.getItem(USER_DATA_KEY);

        if (storedUserDataString) {
          const storedUserData = JSON.parse(storedUserDataString);
          setUserData(storedUserData);
          setIsFirstTimeUser(false);
        } else {
          setIsFirstTimeUser(true);
        }
      } catch (error) {
        console.error("Error during initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRegistration();
  }, []);

  const handleRegistrationComplete = async (
    phoneNumber: string,
    name: string,
  ) => {
    try {
      // Create user data object
      const newUserData = { phoneNumber, name };

      // Save to AsyncStorage
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newUserData));

      // Update state
      setUserData(newUserData);
      setIsFirstTimeUser(false);

      console.log("User registered and saved:", newUserData);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {isFirstTimeUser ? (
        <RegistrationScreen
          onRegisterComplete={handleRegistrationComplete}
          isLoading={false}
        />
      ) : (
        <MainMenu userName={userData?.name} />
      )}

      {locationPermission === false && (
        <View className="absolute bottom-0 left-0 right-0 bg-red-100 p-4">
          <Text className="text-red-600 text-center">
            Location permission is required for attendance tracking
          </Text>
        </View>
      )}
    </SafeAreaProvider>
  );
}
