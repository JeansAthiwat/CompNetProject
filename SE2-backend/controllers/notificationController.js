import Notification from "../models/notificationModel.js";

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    const newNotification = new Notification(notificationData);
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single notification by ID
const getNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a notification by ID
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a notification by ID
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications for a specific user (by learner_id or tutor_id)
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({
      user_id: userId,
    });
    // if (notifications.length === 0) {
    //   return res.status(404).json({ message: 'No notifications found for this user' });
    // }
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Batch update: mark all notifications for a user as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await Notification.updateMany(
      { user_id: userId, read_status: "unread" },
      { $set: { read_status: "read" } }
    );
    res.status(200).json({
      message: `${result.modifiedCount} notifications marked as read`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createNotification,
  getAllNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  getUserNotifications,
  markAllAsRead,
};
