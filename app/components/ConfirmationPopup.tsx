import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { CheckCircle, X } from "lucide-react-native";

interface ConfirmationPopupProps {
  visible: boolean;
  message: string;
  subMessage?: string;
  onDismiss?: () => void;
  type?: "success" | "error";
}

const ConfirmationPopup = ({
  visible = false,
  message = "Operation completed successfully",
  subMessage,
  onDismiss = () => {},
  type = "success",
}: ConfirmationPopupProps) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-[300px] rounded-lg p-6 shadow-lg">
          <View className="absolute right-2 top-2">
            <TouchableOpacity onPress={onDismiss}>
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-4">
            {type === "success" ? (
              <CheckCircle size={48} color="#10b981" />
            ) : (
              <X size={48} color="#ef4444" />
            )}
          </View>

          <Text className="text-center text-gray-800 text-lg mb-2">
            {message}
          </Text>

          {subMessage && (
            <Text className="text-center text-gray-600 mb-4">{subMessage}</Text>
          )}

          <TouchableOpacity
            onPress={onDismiss}
            className={`py-3 px-6 rounded-md ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
          >
            <Text className="text-white text-center font-medium">
              {type === "success" ? "OK" : "Close"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationPopup;
