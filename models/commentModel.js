const mongoose = require("mongoose");

/*

Schema for comments on tasks
task: reference to task
author: reference to user
text: text of comment
timestamps: automatically add timestamps for when the comment was created and when it was last updated
versionKey: false: don't add __v field to the output of the document

*/

const commentSchema = mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
  { versionKey: false },
);

module.exports = mongoose.model("Comment", commentSchema);
