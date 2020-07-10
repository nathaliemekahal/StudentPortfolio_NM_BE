const express=require("express")
const fs=require("fs")
const path=require("path")

const router=express.Router()

const projectsFilePath=path.join(__dirname,"projects.json")

router.get("/",(req,res)=>{//get all projects
    const projectcontentBuffer=fs.readFileSync(projectsFilePath)
    const projectContent=projectcontentBuffer.toString()
    res.send(JSON.parse(projectContent))
})

router.get("/:p_id",(req,res,next)=>{//get proj with specific id
    try{
    const projectcontentBuffer=fs.readFileSync(projectsFilePath)
    const projectsArray=JSON.parse(projectcontentBuffer.toString())
    // console.log("projectsArray",projectsArray)
    let requestedId=req.params.p_id
    const project=projectsArray.filter(project=>project.projid===requestedId)
    res.send(project)
    }catch(error){
        
        error.httpStatusCode = 404
        next(error)
    }
})

router.post("/",(req,res)=>{
    const newProject={...req.body}
    const projectscontentbuffer=fs.readFileSync(projectsFilePath)
    const projectsArray=JSON.parse(projectscontentbuffer.toString())
    projectsArray.push(newProject)
    fs.writeFileSync(projectsFilePath,JSON.stringify(projectsArray))
    res.send(newProject)
})

router.delete("/:p_id",(req,res)=>{
    const projectsArray=JSON.parse(fs.readFileSync(projectsFilePath).toString())
    let filteredArray=projectsArray.filter(project=>project.projid!==req.params.p_id)
    fs.writeFileSync(projectsFilePath,JSON.stringify(filteredArray))
    res.send(filteredArray)
})

router.put("/:p_id",(req,res)=>{
    const projectsArray=JSON.parse(fs.readFileSync(projectsFilePath).toString())
    let filteredArray=projectsArray.filter(project=>project.projid!==req.params.p_id)
    const editproj={...req.body}
    editproj.projid=req.params.p_id
    filteredArray.push(editproj)
    fs.writeFileSync(projectsFilePath,JSON.stringify(filteredArray))
    res.send(filteredArray)

})
module.exports=router