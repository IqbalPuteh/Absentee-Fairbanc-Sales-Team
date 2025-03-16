import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, MapPin, Clock, FileText } from "lucide-react-native";
import * as Location from "expo-location";
import ConfirmationPopup from "./ConfirmationPopup";

interface MeetingAttendanceProps {
  mode?: "checkin" | "checkout";
}

const MeetingAttendance = ({ mode: propMode }: MeetingAttendanceProps) => {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode: "checkin" | "checkout" }>();
  const mode = params.mode || propMode || "checkin";

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.error("Location permission denied");
          setIsLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();
  }, []);

  const handleSubmit = () => {
    if (notes.trim().length === 0) {
      alert("Please enter meeting notes or information");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call to record attendance
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleConfirmationDismiss = () => {
    setShowConfirmation(false);
    router.push("/");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-green-600 p-4 flex-row items-center">
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            Meeting {mode === "checkin" ? "Check In" : "Check Out"}
          </Text>
        </View>

        <ScrollView className="flex-1 p-6">
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-green-600">
              Meeting {mode === "checkin" ? "Check In" : "Check Out"}
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              {mode === "checkin"
                ? "Record your arrival at the meeting"
                : "Record your departure from the meeting"}
            </Text>
          </View>

          <View className="bg-gray-100 rounded-xl p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <Clock size={24} color="#4B5563" />
              <Text className="text-gray-700 ml-3 text-lg">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <View className="flex-row items-center">
              <MapPin size={24} color="#4B5563" />
              <Text className="text-gray-700 ml-3 text-lg">
                {isLoading
                  ? "Getting location..."
                  : location
                    ? `Lat: ${location.coords.latitude.toFixed(
                        4,
                      )}, Long: ${location.coords.longitude.toFixed(4)}`
                    : "Location unavailable"}
              </Text>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium">
              Meeting Notes / Information
            </Text>
            <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
              <View className="flex-row items-start">
                <FileText size={20} color="#4B5563" className="mt-1" />
                <TextInput
                  className="flex-1 ml-2 text-base text-gray-800"
                  placeholder="Enter meeting details, client name, or purpose"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            className={`${mode === "checkin" ? "bg-green-500" : "bg-red-500"} p-6 rounded-xl items-center justify-center`}
            onPress={handleSubmit}
            disabled={isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-xl font-semibold">
                {mode === "checkin" ? "Check In Now" : "Check Out Now"}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        <ConfirmationPopup
          visible={showConfirmation}
          message={`Meeting ${mode === "checkin" ? "Check In" : "Check Out"} Successful`}
          subMessage={`Your ${mode === "checkin" ? "arrival at" : "departure from"} the meeting has been recorded.`}
          onDismiss={handleConfirmationDismiss}
          type="success"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default MeetingAttendance;
