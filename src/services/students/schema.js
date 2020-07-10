const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const valid = require("validator");

const studentSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: async (value) => {
        if (!valid.isAlphanumeric(value)) {
          throw new Error("No special characters allowed including sapce");
        }
      },
    },
  },
  surname: {
    type: String,
    validate: {
      validator: async (value) => {
        if (!valid.isAlphanumeric(value)) {
          throw new Error("No special characters allowed");
        }
      },
    },
  },
  email: {
    type: String,
    validate: {
      validator: async (value) => {
        if (!valid.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
  },
  dateOfBirth: {
    type: String,
    validate: {
      validator: async (value) => {
        if (!valid.isDate(value)) {
          throw new Error("Invalid Date");
        }
      },
    },
  },
  country: String,
});

studentSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

//const studentModel = mongoose.model("student", studentSchema);

//module.exports = studentModel;
module.exports = model("student", studentSchema);