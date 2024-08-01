module.exports.addMessage = async (req, res, next) => {
  try {
    
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    console.log("Data:", data);
    if (data) {
      return res.json({
        msg: "Message added successfully.",
        message: {
          fromSelf: true,
          message: message,
          createdAt: data.createdAt, // This should be correctly set by Mongoose
        },
      });
    } else {
      return res.json({ msg: "Failed to add message to the database" });
    }
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    console.log('hello')
    const { from, to } = req.body;

    const messages = await messageModel.find({
      users: { $all: [from, to] },
    }).sort({ createdAt: 1 });
    console.log(messages)
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt || null, // Use null if createdAt is missing
      };
    });
    res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};

