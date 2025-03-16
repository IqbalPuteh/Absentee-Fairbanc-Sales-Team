import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import ConfirmationPopup from "./ConfirmationPopup";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MapPin, Clock, CheckCircle, XCircle } from "lucide-react-native";

interface OfficeAttendanceProps {
  isCheckedIn?: boolean;
  mode?: "checkin" | "checkout";
  onCheckIn?: (location: { latitude: number; longitude: number }) => void;
  onCheckOut?: (location: { latitude: number; longitude: number }) => void;
}

const OfficeAttendance = ({
  isCheckedIn = false,
  mode: propMode,
  onCheckIn = () => {},
  onCheckOut = () => {},
}: OfficeAttendanceProps) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = (propMode || params.mode || "checkin") as "checkin" | "checkout";

  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    mode === "checkout" || isCheckedIn,
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      // Simulate getting location
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockLocation = {
        latitude: 37.7749,
        longitude: -122.4194,
      };
      setCurrentLocation(mockLocation);
      return mockLocation;
    } catch (error) {
      Alert.alert("Error", "Failed to get your location. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    const location = await getCurrentLocation();
    if (location) {
      onCheckIn(location);
      setCurrentStatus(true);
      setConfirmationMessage("You have successfully checked in!");
      setShowConfirmation(true);

      // Auto-dismiss confirmation after 2 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        router.push("/");
      }, 2000);
    }
  };

  const handleCheckOut = async () => {
    const location = await getCurrentLocation();
    if (location) {
      onCheckOut(location);
      setCurrentStatus(false);
      setConfirmationMessage("You have successfully checked out!");
      setShowConfirmation(true);

      // Auto-dismiss confirmation after 2 seconds
      setTimeout(() => {
        setShowConfirmation(false);
        router.push("/");
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View className="flex-1 bg-white p-6">
      {/* Header */}
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold text-blue-600">
          Office Attendance
        </Text>
        <Text className="text-gray-500 mt-2">
          Record your office attendance
        </Text>
      </View>

      {/* Current Time and Date */}
      <View className="bg-gray-100 rounded-lg p-4 mb-6">
        <View className="flex-row items-center mb-2">
          <Clock size={20} color="#4B5563" />
          <Text className="text-gray-700 ml-2 font-medium">Current Time</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800">
          {formatTime(currentTime)}
        </Text>
        <Text className="text-gray-600 mt-1">{formatDate(currentTime)}</Text>
      </View>

      {/* Location Information */}
      <View className="bg-gray-100 rounded-lg p-4 mb-8">
        <View className="flex-row items-center mb-2">
          <MapPin size={20} color="#4B5563" />
          <Text className="text-gray-700 ml-2 font-medium">Location</Text>
        </View>
        {currentLocation ? (
          <View>
            <Text className="text-gray-800">
              Latitude: {currentLocation.latitude.toFixed(4)}
            </Text>
            <Text className="text-gray-800">
              Longitude: {currentLocation.longitude.toFixed(4)}
            </Text>
          </View>
        ) : (
          <Text className="text-gray-600 italic">
            Location will be captured when you check in/out
          </Text>
        )}
      </View>

      {/* Status */}
      <View className="bg-gray-100 rounded-lg p-4 mb-8">
        <Text className="text-gray-700 font-medium mb-2">Current Status</Text>
        <View className="flex-row items-center">
          {currentStatus ? (
            <>
              <CheckCircle size={24} color="#10B981" />
              <Text className="text-green-600 ml-2 font-bold">Checked In</Text>
            </>
          ) : (
            <>
              <XCircle size={24} color="#EF4444" />
              <Text className="text-red-600 ml-2 font-bold">Checked Out</Text>
            </>
          )}
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        className={`py-4 rounded-lg items-center ${currentStatus ? "bg-red-500" : "bg-green-500"}`}
        onPress={currentStatus ? handleCheckOut : handleCheckIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">
            {currentStatus ? "Check Out" : "Check In"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity
        className="mt-4 py-3 rounded-lg items-center bg-gray-200"
        onPress={() => router.push("/")}
      >
        <Text className="text-gray-700 font-medium">Back to Main Menu</Text>
      </TouchableOpacity>

      {/* Confirmation Popup */}
      <ConfirmationPopup
        visible={showConfirmation}
        message={confirmationMessage}
        onDismiss={() => {
          setShowConfirmation(false);
          router.push("/");
        }}
      />
    </View>
  );
};

export default OfficeAttendance;
