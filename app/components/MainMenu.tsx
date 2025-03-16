import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Clock, Users, LogOut } from "lucide-react-native";

interface MainMenuProps {
  userName?: string;
}

const MainMenu = ({ userName = "User" }: MainMenuProps) => {
  const router = useRouter();

  const handleOfficeAttendance = () => {
    // Navigate to office bridging screen
    router.push("/components/OfficeBridgingScreen");
  };

  const handleMeetingAttendance = () => {
    // Navigate to meeting bridging screen
    router.push("/components/MeetingBridgingScreen");
  };

  const handleExit = () => {
    // Exit the application
    // For web or development, we'll just log this action
    console.log("Exit application");
  };

  return (
    <View className="flex-1 bg-white p-6 justify-between">
      <View className="items-center mt-10">
        <Text className="text-3xl font-bold text-blue-600">Attendance App</Text>
        <Text className="text-lg mt-2 text-gray-600">Welcome, {userName}!</Text>
      </View>

      <View className="flex-1 justify-center gap-6">
        <TouchableOpacity
          className="bg-blue-500 p-6 rounded-xl flex-row items-center"
          onPress={handleOfficeAttendance}
        >
          <Clock size={28} color="white" />
          <Text className="text-white text-xl font-semibold ml-4">
            Office Check In/Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 p-6 rounded-xl flex-row items-center"
          onPress={handleMeetingAttendance}
        >
          <Users size={28} color="white" />
          <Text className="text-white text-xl font-semibold ml-4">
            Meeting/Visit Check In/Out
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 p-6 rounded-xl flex-row items-center"
          onPress={handleExit}
        >
          <LogOut size={28} color="white" />
          <Text className="text-white text-xl font-semibold ml-4">Exit</Text>
        </TouchableOpacity>
      </View>

      <View className="items-center mb-8">
        <Text className="text-gray-500">© 2023 Attendance Tracker</Text>
      </View>
    </View>
  );
};

export default MainMenu;
