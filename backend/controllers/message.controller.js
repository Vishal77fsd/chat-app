import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSockerId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Get All The Conversation Between Sender And Receiver
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // If !Conversation, That Means This Is Their First Conversation
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({ senderId, receiverId, message });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // await conversation.save();
    // await newMessage.save();
    // This will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET FUNCTIONALITY
    const receiverSocketId = getReceiverSockerId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific clients
      io.to(receiverSocketId).emit("newMessages", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in message controller send message", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChat] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }
    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in message controller get messages", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
