import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Phone, User, ArrowRight } from "lucide-react-native";

interface RegistrationScreenProps {
  onRegisterComplete?: (phoneNumber: string, name: string) => void;
  isLoading?: boolean;
}

const RegistrationScreen = ({
  onRegisterComplete = () => {},
  isLoading = false,
}: RegistrationScreenProps) => {
  const [step, setStep] = useState<"phone" | "name">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

  const validatePhone = () => {
    if (phoneNumber.trim().length < 10) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateName = () => {
    if (name.trim().length < 2) {
      setNameError("Please enter your name");
      return false;
    }
    setNameError("");
    return true;
  };

  const handlePhoneNext = () => {
    if (validatePhone()) {
      setStep("name");
    }
  };

  const handleSubmit = () => {
    if (validateName()) {
      onRegisterComplete(phoneNumber, name);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1">
          <View className="flex-1 p-6 justify-center">
            <View className="mb-10 items-center">
              <Text className="text-3xl font-bold text-blue-600 mb-2">
                Welcome
              </Text>
              <Text className="text-gray-600 text-center">
                {step === "phone"
                  ? "Please register with your phone number to continue"
                  : "Tell us your name to complete registration"}
              </Text>
            </View>

            {step === "phone" ? (
              <View className="space-y-6">
                <View>
                  <Text className="text-gray-700 mb-2 font-medium">
                    Phone Number
                  </Text>
                  <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <Phone size={20} color="#4B5563" />
                    <TextInput
                      className="flex-1 ml-2 text-base text-gray-800"
                      placeholder="Enter your phone number"
                      keyboardType="phone-pad"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      autoFocus
                    />
                  </View>
                  {phoneError ? (
                    <Text className="text-red-500 mt-1">{phoneError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  className="bg-blue-600 py-4 rounded-lg flex-row justify-center items-center"
                  onPress={handlePhoneNext}
                >
                  <Text className="text-white font-semibold text-base mr-2">
                    Next
                  </Text>
                  <ArrowRight size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-6">
                <View>
                  <Text className="text-gray-700 mb-2 font-medium">
                    Your Name
                  </Text>
                  <View className="flex-row items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <User size={20} color="#4B5563" />
                    <TextInput
                      className="flex-1 ml-2 text-base text-gray-800"
                      placeholder="Enter your full name"
                      value={name}
                      onChangeText={setName}
                      autoFocus
                    />
                  </View>
                  {nameError ? (
                    <Text className="text-red-500 mt-1">{nameError}</Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  className="bg-blue-600 py-4 rounded-lg flex-row justify-center items-center"
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Text className="text-white font-semibold text-base mr-2">
                        Register
                      </Text>
                      <ArrowRight size={18} color="white" />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-2"
                  onPress={() => setStep("phone")}
                >
                  <Text className="text-blue-600 text-center">
                    Back to phone number
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
