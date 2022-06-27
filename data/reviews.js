const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const studentcourses = mongoCollections.studentcourses;
const reviews = mongoCollections.reviews;
const { ObjectId } = require("mongodb");
const upload = require("express-fileupload");
// const { dropdowndata, reviews } = require("../config/mongoCollections");
const AppError = require("../middleware/appError");
const { ErrorType } = require("../middleware/enum");



async function addreview(coursename,studentusername,teacherusername,ratings,reviews1){
    const reviewscollection = await reviews();
    let rev = {
        // _id: ObjectId, 
        coursename: coursename.trim(),
        studentusername: studentusername,
        teacherusername: teacherusername,
        ratings: ratings,
        reviewss:reviews1
        
    }
    const insertInfo = await reviewscollection.insertOne(rev);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add';
    console.log( await`${reviews1} commented`)
    const newId1= insertInfo.insertedId.toString();

    // const bad = await this.get(newId);
    // return bad;
    return newId1
  }


  async function getallreviews(){
    const reviewscollection = await reviews();
        const insertInfo = await reviewscollection
          .find({})
          .toArray();
        return insertInfo;
}

module.exports={
    addreview,
    getallreviews
}
//   async function main(){
//       console.log(await getallreviews())
//   }
//   main()