import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, LogIn, LogOut } from "lucide-react-native";

interface MeetingBridgingScreenProps {
  isCheckedIn?: boolean;
}

const MeetingBridgingScreen = ({
  isCheckedIn = false,
}: MeetingBridgingScreenProps) => {
  const router = useRouter();

  const handleCheckIn = () => {
    router.push("/components/MeetingAttendance?mode=checkin");
  };

  const handleCheckOut = () => {
    router.push("/components/MeetingAttendance?mode=checkout");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 p-4 flex-row items-center">
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">
          Meeting/Visit Attendance
        </Text>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-blue-600">
            Meeting/Visit Attendance
          </Text>
          <Text className="text-gray-500 mt-2 text-center">
            Select an action to record your meeting attendance
          </Text>
        </View>

        <View className="space-y-6">
          <TouchableOpacity
            className="bg-green-500 p-6 rounded-xl flex-row items-center justify-center"
            onPress={handleCheckIn}
          >
            <LogIn size={28} color="white" />
            <Text className="text-white text-xl font-semibold ml-4">
              Check In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 p-6 rounded-xl flex-row items-center justify-center"
            onPress={handleCheckOut}
          >
            <LogOut size={28} color="white" />
            <Text className="text-white text-xl font-semibold ml-4">
              Check Out
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-gray-300 p-6 rounded-xl flex-row items-center justify-center mt-4"
            onPress={handleBack}
          >
            <ArrowLeft size={28} color="#4B5563" />
            <Text className="text-gray-700 text-xl font-semibold ml-4">
              Return to Main Menu
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MeetingBridgingScreen;
