const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const valid = require("validator");
// const studentModel = require("./schema");
const projectSchema = new Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});
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
  projects: [projectSchema],
  ImageUrl:String
});

studentSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});
studentSchema.static("addProject", async function (id, project) {
  await studentModel.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { projects: project },
    }
  );
});
studentSchema.static("getProjects", async function (id) {
  let projects= await studentModel.find(
    {_id: id },
    {
      projects:1,
      _id:0 
    }
  )
  return projects
});
studentSchema.static("removeProjectFromStudent", async function (id, projectID) {
  await studentModel.findByIdAndUpdate(id, {
    $pull: { projects: { _id: projectID } },
  })
})
//ADDING IMGURL 
studentSchema.static("addImgUrl", async function (id, imgUrl) {
  await studentModel.update(
    { _id: id },
    
    {
      ImageUrl:imgUrl
    },
    {multi:true}, 
 
)})
studentSchema.static('returnImgURL',async function(id){
  let imgurl=await studentModel.find(
    {_id:id},
    {
      ImageUrl:1,
      _id:0
    }
    
  )
  return imgurl
})

// studentSchema.static("updateProject", async function (
//   id,
//   projectID,
//   body
// ) {
//  let something = await studentModel.findOneAndUpdate({
//     _id: id,
//     "projects._id": projectID,
//     body:body,
    
  
//   },
//   { $set: { "projects.$": body } }
//   )
// }

// )
//const studentModel = mongoose.model("student", studentSchema);

//module.exports = studentModel;
const studentModel = mongoose.model("student", studentSchema);

module.exports = studentModel;