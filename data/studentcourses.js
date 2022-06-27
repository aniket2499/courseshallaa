const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const studentcourses = mongoCollections.studentcourses;
const { ObjectId } = require("mongodb");
const upload = require("express-fileupload");
const { dropdowndata } = require("../config/mongoCollections");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");
const { response } = require("express");
const { query } = require("express");


async function gettagsdropdown(type){
    const dropdowndatacollection = await dropdowndata();
      const info = await dropdowndatacollection.find({}).toArray();
      if (!info) {
        throw new AppError("failed to get tags", ErrorType.not_found);
      }
      return info;

}
async function addcourse(coursename,studentusername,teacherusername,type){
    const scoursescollection = await studentcourses();
    let stud = {
        // _id: ObjectId, 
        coursename: coursename.trim(),
        studentusername: studentusername,
        teacherusername: teacherusername,
        type: type,
        assignments: []
        
    }
    const insertInfo = await scoursescollection.insertOne(stud);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add';
    const newId = insertInfo.insertedId.toString();

    // const bad = await this.get(newId);
    // return bad;
    return newId
}



async function allCourses(username){
    let enrolledcoursesin = await enrolledcourses(username);
    let enrolledcoursesids = []
    for(let i = 0 ; i < enrolledcoursesin.length ; i++){
        enrolledcoursesids.push(enrolledcoursesin[i].course_id)
    }
    const coursescollection = await courses();
        const insertInfo = await coursescollection
          .find({"_id": {$nin : enrolledcoursesids} })
          .toArray();
        return insertInfo;
}

async function enrolledcourses(username){
    const coursescollection = await studentcourses();
        const enrolledinfo = await coursescollection
          .find({ $and: [{ "studentusername": username },{"type":"enrolled"}]},{ projection: { "course_id": 1, "coursename": 1, "_id": 0 } })
          .toArray();
        let enrolledcourses = []
        for( let x =0 ; x < enrolledinfo.length ; x++){
            enrolledcourses.push(await coursescollection.findOne({"course_id":enrolledinfo[x].course_id}))
        }

        return enrolledcourses;
}

async function recommend(username){
    const coursescollection= await courses()
    const studentcoursecollection= await studentcourses()
    const insertInfo = await coursescollection.find({}).toArray();
    const enrolledinfo = await studentcoursecollection.find({ $and: [{ "studentusername": username },{"type":"enrolled"}]},{ projection: { "coursename": 1, "_id": 0 } }).toArray();
    let recommendations

    for(i=0;i<enrolledinfo.length;i++){
        recommendations=[]
        for(j=0;j<insertInfo.length;j++){
           
            if(insertInfo[j].coursename==enrolledinfo[i].coursename){
                 recommendations.push(insertInfo[j].coursetag)
            }
        }
    }
    if(recommendations!==undefined){
    const recommendInfo = await coursescollection.find({"coursetag":{$in:recommendations}}).toArray();
    return recommendInfo
    }
    else{
        return insertInfo
    }
}

async function getdetailsforsubmission(id){
    let coursescollection = await courses();
    let new_obj = await coursescollection.findOne({"assignments._id": ObjectId(id)}, {projection: {"username": 1, "coursename": 1, "serialnumber": 1}})
    return new_obj;
}

async function adduploadedassignment(obj){
    let coursescollection = await studentcourses();
    let findone = await coursescollection.findOne({$and: [{ "coursename": obj.coursename},{"studentusername" : obj.studentusername},{"teacherusername" : obj.teacherusername},{"assignment.assignment_id": ObjectId(obj.assignment_id)}]},{ projection: { "_id": 0 } })
    
    let assignmentobject = {
        "path": obj.path,
        "duedate": "",
        "grade":0,
        "gradeposted":0,
        "assignmenttitle": obj.assignmenttitle,
        "assignment_id": ObjectId(obj.id)
    }
    if(findone === null){    
        let new_obj = await coursescollection.updateOne({$and: [{ "coursename": obj.coursename},{"studentusername" : obj.studentusername},{"teacherusername" : obj.teacherusername}]}, {$push: 
            { "assignments": {
                "path": obj.path,
                "duedate": "",
                "grade":0,
                "gradeposted":0,
                "assignmenttitle": obj.assignmenttitle,
                "assignment_id": ObjectId(obj.id)
            }}
        });
    }
    else{
        let new_obj = await coursescollection.updateOne({"assignments.assignment_id": ObjectId(obj.id), "_id": id}, {$set: {"assignments.path": obj.path}});
    }
    return true;

    }

//     return obj;
// }

async function finduploadedassignment(teacherusername,coursename,id){
    let coursescollection = await studentcourses();
    let find_info = await coursescollection.findOne({"assignments.assignment_id": ObjectId(id),"teacherusername":teacherusername,"coursename":coursename},{projection: {"assignments": 1, "_id": 0}});
    return find_info
}

async function main(){
    console.log(await recommend("Hariom"))
}

main()
module.exports={
    addcourse,
    allCourses,
    enrolledcourses,
    recommend,
    getdetailsforsubmission,
    adduploadedassignment,
    finduploadedassignment
    // finduploadedassignment
}