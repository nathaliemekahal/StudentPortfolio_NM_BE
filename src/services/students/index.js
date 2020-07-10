const express=require('express')
const fs = require('fs')
const path=require('path')
const uniqid=require('uniqid')
const multer = require("multer")
const { join } = require("path")
const {readFile, writeFile, createReadStream } = require("fs-extra")
const upload = multer({})
const studentSchema = require("./schema")
const mongoose = require("mongoose");
const q2m = require("query-to-mongo");

const router=express.Router()

const studentsFilePath=path.join(__dirname, "students.json")

// router.get("/",(request,response)=>{
//   const fileContentAsABuffer = fs.readFileSync(studentsFilePath) // please read the file (we are getting a Buffer back)

//   const fileContent = fileContentAsABuffer.toString() 
//   response.send(JSON.parse(fileContent))
// })

// router.get("/", async (req, res, next) => {
//   try {
//     const students = await studentSchema.find(req.query)
//     res.send(students)
//   } catch (error) {
//     next(error)
//   }
// })
router.get("/", async (req, res) => {
  try {
    const query = q2m(req.query);
    console.log(query);
    const students = await studentSchema
      .find()
      .limit(query.options.limit)
      .skip(query.options.skip)
      .sort(query.options.sort);
    res.send(students);
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const student = await studentSchema.findById(id)
    if (student) {
      res.send(student)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading books list a problem occurred!")
  }
})
// router.get("/:id", (request, response) => {
//   const fileContentAsABuffer = fs.readFileSync(studentsFilePath)
//   const studentsArray = JSON.parse(fileContentAsABuffer.toString())
//   console.log('studentsArray',studentsArray)

//   console.log("ID: ", request.params.id.toString())
//   const student = studentsArray.filter((student) => student.id ==request.params.id)
//   console.log(student)
//   // c. send the user back into the response
//   response.send(student)
// })
router.post("/", async (req, res, next) => {
  try {
    const newStudent = new studentSchema(req.body)
    const { _id } = await newStudent.save()

    res.status(201).send('created')
  } catch (error) {
    next(error)
  }
})
// router.post("/", (request, response) => {
//   console.log(request.body)
//   const newStudent = { ...request.body, id: uniqid() }
//   const fileContentAsABuffer = fs.readFileSync(studentsFilePath)
//   const studentsArray = JSON.parse(fileContentAsABuffer.toString())
//   let count=0
//   for(Student of studentsArray){
//     if(newStudent.Email===Student.Email){
//       count++
//     }
//     else{
//       console.log('pkpk')
//     }
//   }
//   if(count===0){
//     studentsArray.push(newStudent)
//     fs.writeFileSync(studentsFilePath, JSON.stringify(studentsArray))
//     response.status(201).send(newStudent)
//   }
//   else{
//     console.log('EMAIL EXISTS')
//     response.send('ERROR')
//   }

 
// })
// router.put("/:id", (request, response) => {

//   const fileContentAsABuffer = fs.readFileSync(studentsFilePath)
//   const studentsArray = JSON.parse(fileContentAsABuffer.toString())
//   const filteredstudentsArray = studentsArray.filter(
//     (student) => student.id !== request.params.id
//   )

//   // 3. adding back the user with the modified body
//   const student = request.body // request.body is holding the new data for the specified user
//   student.id = request.params.id

//   filteredstudentsArray.push(student)
//   fs.writeFileSync(studentsFilePath, JSON.stringify(filteredstudentsArray))
//   response.send("Ok")
// })
// router.delete("/:id", (request, response) => {


//   const fileContentAsABuffer = fs.readFileSync(studentsFilePath)
//   const studentsArray = JSON.parse(fileContentAsABuffer.toString())

//   const filteredstudentsArray = studentsArray.filter(
//     (student) => student.id !== request.params.id
//   )


//   fs.writeFileSync(studentsFilePath, JSON.stringify(filteredstudentsArray))
//   response.send("Ok")
// })
const studentsFolderPath = join(__dirname, "../../../public/img/students")


router.post("/:id/uploadPhoto", upload.single("avatar"), async (req, res, next) => {
  // req.file <-- here is where we're gonna find the file
  console.log(req.file.buffer)
  console.log('joj')
  
  try {
    
    await writeFile(
      join(studentsFolderPath, req.params.id+'.'+req.file.originalname.split('.').pop()),
      req.file.buffer
    )
   
    const studentsArray= JSON.parse(fs.readFileSync(studentsFilePath).toString())
    studentsArray.forEach(student =>{
      if(student.id === req.params.id){
        student['imageUrl'] =` http://localhost:3000/img/students/${req.params.id}.${req.file.mimetype.slice(-3)}`
      }
      fs.writeFileSync(studentsFilePath, JSON.stringify(studentsArray))
      res.send('uploaded successfully')
    })

  } catch (error) {
    console.log(error)
  }
  res.send("ok")
})

router.put("/:id", async (req, res, next) => {
  try {
    const student = await studentSchema.findByIdAndUpdate(req.params.id, req.body)

    if (student) {
      res.send("Ok")
    } else {
      const error = new Error(`book with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

router.delete("/:id", async (req, res, next) => {
  try {
    const student = await studentSchema.findByIdAndDelete(req.params.id)
    if (student) {
      res.send("Deleted")
    } else {
      const error = new Error(`book with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

router.post("/checkEmail", async (req, res) => {
  
  const checkemail = await studentSchema.find({ email: req.body.email });

  if (checkemail.length !== 0) {
    res.send("ERROR!!! EMAIL EXISTS!!");
  } else {
    res.send("SUCCESS!! EMAIL CAN BE USED");
  }
});
router.get("/:id/getPhoto", (req, res, next) => {
  try {
      if (fs.existsSync(path.join(studentsFolderPath, `${req.params.id}.png`))) {
          const source = fs.createReadStream(path.join(studentsFolderPath, `${req.params.id}.png`))
          source.pipe(res)
      } else {
          const err = new Error()
          err.httpStatusCode = 404
          err.message = "Not found!"
          next(err)
      }

  } catch (error) {
      next(error)
  }
})


module.exports = router