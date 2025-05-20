import Room from "../models/room.model.js";

const reservedNames = ["admin", "system", "null", "undefined", "root"];

export const auth = async (req, res) => {
  let { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Room name required" });
  }
  name = name.trim().toLowerCase();

  if (name.length > 16) {
    return res
      .status(400)
      .json({ message: "Room name must be 16 characters or fewer." });
  }
  if (!/^[a-z0-9]+$/i.test(name)) {
    return res.status(400).json({
      message: "Room name can only contain alphanumeric characters (A-Z, 0-9).",
    });
  }
  if (reservedNames.includes(name)) {
    return res.status(400).json({
      message: "This room name is reserved. Please choose another name.",
    });
  }

  try {
    let room = await Room.findOne({ name });
    if (!room) {
      room = new Room({ name });
      await room.save();
      console.log(`New room created: ${name}`);
      return res.status(201).json({ message: "Room created and joined", room });
    }
    console.log(`User joined existing room: ${name}`);
    return res.status(200).json({ message: "Joined existing room", room });
  } catch (error) {
    console.error(`Error in authRoom for room "${name}": ${error.message}`);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
