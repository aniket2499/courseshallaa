const express = require("express");
const session = require("express-session");
const upload = require('express-fileupload');
const fs = require("fs");
const res = require("express/lib/response");
const router = express.Router();
const data = require("../data");
const AppError = require("../middleware/appError");

router.use(upload())

router.get("/", async function (req, res, next) {
    try {
      let username = req.session.user.Username;
      let coursesData = data.studentcourses;
      let courses = await coursesData.allCourses(username);
      let enrolledcourses=await coursesData.enrolledcourses(username)
      let reconmmendedcourses=await coursesData.recommend(username)
      
      for(x in courses){
        let string = ""
        for(let y of courses[x].description){
            string = string + y;
            if(y === '.'){
                string = string + y;
                break;
            }
        }
        courses[x].description = string;
        courses[x]._id = courses[x]._id.toString();
      }
      if(enrolledcourses){
        for(let x = 0 ; x < enrolledcourses.length ; x++){
          enrolledcourses[x].course_id
        }
      }
      res.render("./mainpage/studentsDashboard", { navbar: true, courses: courses,enrolled:enrolledcourses,recom:reconmmendedcourses});
    } catch (error) {
        throw error;
    }
  });

  router.get("/reviews", async function (req,res,next){
    try{
      let username = req.session.user.Username;
      let reviewData = data.reviews;
      let reviews2=await reviewData.getallreviews()
      res.render("./mainpage/reviews",{reviews:reviews2})
    }
    catch (error) {
      next(error);
    }
  })

  router.post("/reviews", async function (req,res,next){
    try{
      
      let ratings=req.body.Ratings
      let reviews=req.body.review
      let teacherusername="user3"
      let username = req.session.user.Username;
      let coursename="Web"
      let reviewData = data.reviews;
      let reviews2=await reviewData.addreview(coursename,username,teacherusername,ratings,reviews)
      let reviews3=await reviewData.getallreviews()
      res.render("./mainpage/reviews",{reviews:reviews3})
    }
    catch (error) {
      next(error);
    }
  })

  router.post("/updatesequencenumber", async function(req,res){
    let studentusername = req.session.user.Username;
    let courseid = req.body.courseid;
    let sequencenumber = req.body.sequencenumber;
    let courses = data.enrolled_courses
    const enrolledCourseVideoDetails = await courses.updatesequencenumber(studentusername,courseid,sequencenumber);
    if(enrolledCourseVideoDetails == true){
      return res.json({status: true})
    }
    else{
      return res.json({status: false})
    }
  })

  router.get('/enrolled/ajaxvideos/:id',async (req, res) => {
    let studentusername = req.session.user.Username;
    let course_id = req.params.id;
    let courses = data.enrolled_courses
    const enrolledCourseVideoDetails = await courses.getEnrolledVideoDetails(course_id,studentusername);
    let sequencenumber = enrolledCourseVideoDetails.sequencenumber;
    let videos = enrolledCourseVideoDetails.videodetails[0].videos;
    let obj = {};
    obj.sequencenumber = sequencenumber;
    obj.videos = videos;
    return res.json(obj);
  })

  router.get('/enrolled/videos/:id', async (req, res) => {
    const course_id = req.params.id;
    res.render('mainpage/studentvideoslog', {id: course_id});
});

router.get('/enrolled/:id', async (req, res) => {
    const id = req.params.id;
    let courses = data.enrolled_courses
    const enrolledCourse = await courses.getEnrolledCourseById(id);
    enrolledCourse._id = enrolledCourse._id.toString();
    res.render('mainpage/enrollecourse', {course: enrolledCourse});
});


router.get('/not_enrolled/:id', async (req, res) => {
  const id = req.params.id;
  let courses = data.enrolled_courses
  const enrolledCourse = await courses.getEnrolledCourseById(id);
  enrolledCourse._id = enrolledCourse._id.toString();
  res.render('mainpage/notenrolledcourse', {course: enrolledCourse});
});


router.get('/enrollthestudent/:id', async(req,res)=>{
  const id  = req.params.id;
  const username = req.session.user.Username;
  let courses = data.enrolled_courses;
  const enrolledCourse = await courses.onEnrollment(id,username);
  res.redirect('/student');
});


router.post('/uploadassignment',async(req,res)=>{           // when the teacher press upload video button this post method is called.
  let filedata = req.files.textfile;
  let filename = req.files.textfile.name;

  let studentusername = req.session.user.Username;
  // let username = 'user3'
  let coursename = decodeURI(req.body.coursename);
  // let videotitle = decodeURI(req.body.videotitle);
  // let sequencenumber = decodeURI(req.body.sequencenumber);
  // let videodescription = decodeURI(req.body.description)

  let id = decodeURI(req.body.id);
  let teacherusername =  decodeURI(req.body.teacherusername);

  let initialpath = '/public/uploads/'

  try {
    if (!fs.existsSync("." + initialpath + studentusername)) {
      fs.mkdirSync("." + initialpath + studentusername);
    }
    if (!fs.existsSync("." + initialpath + studentusername + "/" + coursename)) {
      fs.mkdirSync("." + initialpath + studentusername + "/" + coursename);
    }
    if (!fs.existsSync("." + initialpath + studentusername + "/" + coursename + "/assignments")) {
      fs.mkdirSync("." + initialpath + studentusername + "/" + coursename + "/assignments");
    }
  } catch (err) {
    console.error(err);
  }

  let finalpath = initialpath + studentusername + "/" + coursename + "/assignments/"
  //  finalpath+filename
  filedata.mv("." + finalpath + "/" + filename,function(err){
      if(err){
        console.log("error");
          // return res.json({true: true})
      }else{
        console.log("done")
          // return res.json({true: true})
      }
  })

  let transferdata = {
      teacherusername : teacherusername,
      coursename : coursename,
      studentusername : studentusername,
      id: id,
      path: finalpath + filename
  }

  
  let uploadassignment = data.studentcourses;

  let result; 
  try{ 
      result = await uploadassignment.adduploadedassignment(transferdata)
  }catch(e){
      throw e;
  }

  return res.redirect(`/student/ass_sub_bystudents/${teacherusername}/${coursename}/${id}`)

  // return res.json({"assignment": transferdata});
})

router.get('/assignmentssubmission/:id', async(req,res)=>{
  // const coursename = req.params.coursename
  // const teacherusername = req.params.teacherusername
  // const studentusername = req.session.user.username
  
  const id = req.params.id;
  let students = data.studentcourses;
  let uandcobj;
  try{
    uandcobj = await students.getdetailsforsubmission(id);
  }catch(e){

  }
  uandcobj.studentusername = req.session.user.Username;
  uandcobj.teacherusername = uandcobj.username;
  uandcobj.id = id;

  res.render('mainpage/submitassignment',{object: uandcobj});

})



router.get('/ass_sub_bystudents/:teacherusername/:coursename/:id',async(req,res)=>{
    let teacherusername = req.params.teacherusername;
    let coursename = req.params.coursename;
    let id = req.params.id;

    let uploadassignment = data.studentcourses;

    let result; 
    try{ 
        result = await uploadassignment.finduploadedassignment(teacherusername,coursename,id)
        
    }catch(e){
        throw e;
    }
    return res.json({assignment: result});
})

module.exports=router;