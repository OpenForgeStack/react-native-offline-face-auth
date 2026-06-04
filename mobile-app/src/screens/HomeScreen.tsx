import React from "react";
import {
  View,
  Button,
  Alert
} from "react-native";

import {
  markAttendance
} from "../services/attendanceApi";

export default function HomeScreen() {

  const handlePress = async () => {

    try {

      const result =
        await markAttendance();

      Alert.alert(
        "Success",
        JSON.stringify(result)
      );

    } catch (error) {

      Alert.alert(
        "Error",
        "API Failed"
      );

    }

  };

  return (
    <View
      style={{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
      }}
    >
      <Button
        title="Mark Attendance"
        onPress={handlePress}
      />
    </View>
  );
}