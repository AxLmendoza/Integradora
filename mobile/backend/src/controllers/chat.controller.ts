import { Request, Response } from "express";
import { pusher } from "../config/pusher";

export const sendMessage = async (req: Request, res: Response) => {
  const { username, message } = req.body;

  await pusher.trigger("chat-channel", "new-message", {
    username,
    message,
  });

  res.status(200).json({ success: true });
};
