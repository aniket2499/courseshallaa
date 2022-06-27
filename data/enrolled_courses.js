const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const courses = mongoCollections.courses;
const studentcourses =mongoCollections.studentcourses;
const { ObjectId } = require('mongodb');
const upload = require('express-fileupload');
const { dropdowndata } = require('../config/mongoCollections');
// const { courses } = require('.');
// const { users } = require('.');

const getCourseByNameAndCourse = async(courseName, username) => {
    const courses = await courseCollection();
    const course = await courses.findOne({$and:[{username: username}, {coursename: courseName}]})
    //console.log('Course: ',course)
    return course;
}

const getAssigmentById = async(id) => {
    const assignments = await assignmentCollection();
    const assignment = await assignments.findOne({_id: ObjectId(id)});
    //console.log('Data Assigment:',assignment)
    return assignment;
}

const updatesequencenumber = async(studentusername,courseid,sequencenumber) => {
    let coursescollection = await courses();
    let maxsequencenumber = await coursescollection.find({"_id": ObjectId(courseid)}, {projection: {"_id": 0, "videos.sequencenumber": 1}}).toArray();
    maxsequencenumber = maxsequencenumber[0].videos[maxsequencenumber[0].videos.length - 1].sequencenumber
    let studentcoursescollection = await studentcourses();
    let currentsequencenumber = await studentcoursescollection.findOne({"studentusername": studentusername, "course_id": ObjectId(courseid)}, {projection: {"_id": 0, "videos": 1}})
    if(Number(sequencenumber) < maxsequencenumber && Number(sequencenumber) >= currentsequencenumber.videos){
        let studentcoursescollection = await studentcourses()
        let updatedinfo = await studentcoursescollection.updateOne({"studentusername": studentusername, "course_id": ObjectId(courseid)}, {$set: {"videos": Number(sequencenumber) + 1}})
        return true
    }
    return false
}

async function getEnrolledVideoDetails(course_id,studentusername){
    let studentcoursescollection = await studentcourses();
    let sequencenumber = await studentcoursescollection.findOne({"course_id" : ObjectId(course_id), "studentusername": studentusername},{projection: {"videos": 1, "_id": 0}}); 
    sequencenumber = sequencenumber.videos;
    let coursescollection = await courses();
    let videodetails = await coursescollection.find({"_id": ObjectId(course_id)},{projection: {"videos": 1, "_id": 0}}).toArray();
    let obj = {};
    obj.videodetails = videodetails;
    obj.sequencenumber = sequencenumber;
    return obj;
}

async function onEnrollment(id,studentusername)
{
    try{
        const coursescollection = await courses();
    const course = await coursescollection.findOne({"_id": ObjectId(id)})

    let obj = {
        _id:ObjectId(),
        coursename : course.coursename,
        teachersusername : course.username,
        studentusername: studentusername,
        type: "enrolled",
        assignments: [],
        videos: 1, 
        course_id: ObjectId(id)
    }

    let findcoursetag = await courses();
    let tag = await findcoursetag.findOne({"coursename": course.coursename, "username": course.username},{"projection": {"coursetag": 1, "_id": 0}});

    let userscollection = await users();
    let addtagstouser = await userscollection.updateOne({"username": studentusername},{$push: {"courseenrolledtags": tag.coursetag}})

    const studentcoursescollection = await studentcourses();
    const insertInfo = await studentcoursescollection.updateOne({"coursename": course.coursename, "teacherusername": course.username, "studentusername": studentusername},
        {  
            $setOnInsert: { 
                "coursename": course.coursename,
                "teachersusername" : course.username,
                "studentusername": studentusername,
                "type": "enrolled",
                "assignments": [],
                "videos": 1,
                "course_id": ObjectId(id)
            } 
        },{upsert:true});
    if(insertInfo.upsertedCount == 0){
        throw "course already exists"
    } 
    return obj;
    if(!insertInfo.acknowledged){
        throw "Error inserting values"
    }
        else return insertInfo.acknowledged;
    }catch(e){
        console.log(e);
    }
}

const getEnrolledCourseById = async(id) => {
    const coursescollection = await courses();
    const enrolledCourse = await coursescollection.findOne({_id: ObjectId(id)});
    return enrolledCourse;
}

async function checkIfFinished(id)
{
    const enrolledCollection = await enrolledCourses();
    const enrolledCourse = await enrolledCollection.findOne({_id: ObjectId(id)});

    let assignmentlist = enrolledCourse.assignments;

    for(i in assignmentlist)
    {
        if(assignmentlist.studentFile="")
        {
            return false;
        }
    } 
    
    return true;

}

async function getEnrolledCourses(user)
{
    try{
        const enrolledCollection = await enrolledCourses();
        username=user.username;
        const studentCourses = await enrolledCollection.find({username:username}).toArray();
        return studentCourses;
    }
    catch(e){
        console.log(e)
    }

}

async function onAssSubmit(user)
{
    try{
        let username=user.username;
        let teacher=user.teacher;
        let course_name=user.course_name;
        let assignment_number=user.assignment_number;

        
        const enrolledCollection = await enrolledCourses();   
        const assignmentsCollection = await assignments();
        
        
        //const enrolledList = await enrolledCollection.findOne({teacher:teacher,course_name:course_name,username:username});
        // console.log(enrolledList)

        // if (enrolledList === null) throw 'error';

        
        const updated = await enrolledCollection.update(
            {$and:[{"teacher":teacher},{"course_name":course_name},{"username":username},{"assignments.assignment_number":"1"}]},
            { $set: { "assignments.$.file" : "updated_path" } }
            //{ $set: { "videos" : "updated_path" } }
        )
        if(!updated.acknowledged){
            throw "Error inserting values"
        }

    }catch(e){(console.log(e))};
}

module.exports={
    getEnrolledCourseById,
    onEnrollment,
    getEnrolledVideoDetails,
    updatesequencenumber
}