import { Router } from "express";
import Attendance from "../models/attendance.model";

const router = Router();

router.post("/sync", async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);

    res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const records = await Attendance.find();

    res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

router.post("/bulk-sync", async (req, res) => {
  try {
    const records = req.body;

    const savedRecords =
      await Attendance.insertMany(records);

    res.status(201).json({
      success: true,
      count: savedRecords.length,
      data: savedRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
});

export default router;