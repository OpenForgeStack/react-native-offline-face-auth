import axios from "axios";

const API_URL =
  "http://192.168.0.4:5000/api/attendance";

export const markAttendance = async () => {

  const response = await axios.post(
    `${API_URL}/sync`,
    {
      employeeId: "EMP001",
      timestamp: new Date().toISOString(),
      latitude: 12.9716,
      longitude: 77.5946,
    }
  );

  return response.data;
};