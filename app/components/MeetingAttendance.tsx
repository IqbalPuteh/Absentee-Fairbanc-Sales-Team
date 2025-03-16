import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import ConfirmationPopup from "./ConfirmationPopup";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MapPin, Clock, ArrowLeft, CheckCircle } from "lucide-react-native";

interface MeetingAttendanceProps {
  isCheckedIn?: boolean;
  mode?: "checkin" | "checkout";
  onCheckIn?: (
    notes: string,
    location: { latitude: number; longitude: number },
  ) => void;
  onCheckOut?: (
    notes: string,
    location: { latitude: number; longitude: number },
  ) => void;
}

const MeetingAttendance = ({
  isCheckedIn = false,
  mode: propMode,
  onCheckIn = () => {},
  onCheckOut = () => {},
}: MeetingAttendanceProps) => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const mode = (propMode || params.mode || "checkin") as "checkin" | "checkout";

  // Set initial check-in status based on mode prop
  const initialCheckedIn = mode === "checkout" || isCheckedIn;
  const [notes, setNotes] = useState("");
  const [isCheckedInState, setIsCheckedInState] = useState(initialCheckedIn);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Simulate getting location
  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      // Simulate location fetch delay
      setTimeout(() => {
        // Mock location data
        setLocation({
          latitude: 37.7749,
          longitude: -122.4194,
        });
        setLoading(false);
      }, 1000);
    };

    getLocation();
  }, []);

  const handleAction = () => {
    if (!location) {
      Alert.alert("Error", "Unable to get your location. Please try again.");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isCheckedInState) {
        onCheckOut(notes, location);
      } else {
        onCheckIn(notes, location);
      }
      setLoading(false);
      setShowConfirmation(true);

      // Auto navigate back after confirmation
      setTimeout(() => {
        setShowConfirmation(false);
        router.back();
      }, 2000);
    }, 1000);
  };

  const handleBack = () => {
    router.back();
  };

  if (showConfirmation) {
    return (
      <View className="flex-1 bg-white justify-center items-center p-6">
        <ConfirmationPopup
          visible={true}
          message={
            isCheckedInState
              ? "Meeting Check-Out Successful"
              : "Meeting Check-In Successful"
          }
          subMessage="Your attendance has been recorded successfully."
          onDismiss={() => {
            setShowConfirmation(false);
            router.back();
          }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 p-4 flex-row items-center">
        <TouchableOpacity onPress={handleBack} className="mr-4">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">
          Meeting/Visit {isCheckedInState ? "Check-Out" : "Check-In"}
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Location Info */}
        <View className="bg-blue-50 rounded-lg p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <MapPin size={20} color="#3b82f6" />
            <Text className="ml-2 font-bold text-blue-700">
              Current Location
            </Text>
          </View>

          {loading ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text className="text-blue-600 mt-2">
                Getting your location...
              </Text>
            </View>
          ) : location ? (
            <View>
              <Text className="text-gray-700">
                Latitude: {location.latitude.toFixed(6)}
              </Text>
              <Text className="text-gray-700">
                Longitude: {location.longitude.toFixed(6)}
              </Text>
              <Text className="text-gray-700 mt-2">
                {/* Mock address */}
                123 Business Street, San Francisco, CA 94103
              </Text>
            </View>
          ) : (
            <Text className="text-red-500">Unable to get location</Text>
          )}
        </View>

        {/* Time Info */}
        <View className="bg-blue-50 rounded-lg p-4 mb-4">
          <View className="flex-row items-center mb-2">
            <Clock size={20} color="#3b82f6" />
            <Text className="ml-2 font-bold text-blue-700">Current Time</Text>
          </View>
          <Text className="text-gray-700">{new Date().toLocaleString()}</Text>
        </View>

        {/* Meeting Notes */}
        <View className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <Text className="font-bold text-gray-700 mb-2">Meeting Notes</Text>
          <TextInput
            className="bg-gray-50 p-3 rounded-md text-gray-700 min-h-[100px]"
            placeholder="Enter meeting details, client name, purpose, etc."
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          className={`py-4 px-6 rounded-lg ${isCheckedInState ? "bg-red-600" : "bg-green-600"} items-center mb-6`}
          onPress={handleAction}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">
              {isCheckedInState ? "Check Out" : "Check In"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MeetingAttendance;
