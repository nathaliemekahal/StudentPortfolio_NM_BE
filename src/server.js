
/*
    Students Portfolio Repo
    You are in charge of creating a Student Portfolio Repo for both Frontend and Backend.
    In this first "step" the application should enable the creation, editing, deletion, listing of students.
    Student should have this information:
    - Name
    - Surname
    - ID
    - Email
    - Date of Birth
    //BACKEND
    You are in charge of building the Backend using ExpressJS. The backend should include the following routes:
    GET /students => returns the list of students
    GET /students/123 => returns a single student
    POST /students => create a new student
    PUT /students/123 => edit the student with the given id
    DELETE /students/123 => delete the student with the given id
    The persistence must be granted via file system (es.: Json file with a list of students inside)
    [EXTRA] POST /checkEmail => check if another student has the same email. The parameter should be passed in the body.
    It should return true or false.
    It should not be possible to add a new student (with POST /students) if another has the same email. 
    //FRONTEND
    You are in charge of building the Frontend too. Use ReactJS to create an application for managing the students.
    The features for the application are:
    - Add a new Student ([EXTRA]use CheckEmail before sending the post to the backend)
    - Show Students on a list
    - Every Student could be edited or deleted
*/
const express=require("express")
const cors = require("cors")
const studentsRoutes = require("./services/students")
const projectRoutes=require("./services/projects")
const problematicRoutes = require("./services/problematicRoutes")
const {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    catchAllHandler,
  } = require("./errorHandling")
  const mongoose = require("mongoose")

const server = express()

server.use(cors())
server.use(express.json()) 


server.use("/students", studentsRoutes)
server.use("/projects",projectRoutes)
server.use("/problems", problematicRoutes)


server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

mongoose
  .connect("mongodb://localhost:27017/studentsportfolio", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(3002, () => {
      console.log("Running on port", 3002)
    })
  )
  .catch((err) => console.log(err))