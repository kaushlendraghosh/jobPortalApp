import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import Job from '../models/Job.js'
import { v2 as cloudinary } from "cloudinary"
import jwt from "jsonwebtoken";

//  Get user Data 
export const getUserData = async (req, res) => {
  try {
    // 1. Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 2. Decode the token (no verification yet)
    const decoded = jwt.decode(token);
    // console.log("Decoded Token:", decoded); // Debug: Check the payload

    // 3. Extract userId (Clerk stores it in `sub`)
    const userId = decoded?.sub;
    // console.log("User ID from Token:", userId); // Debug: Check the userId
    if (!userId) {
      return res.status(401).json({ success: false, message: "No userId in token" });
    }

    // 4. Fetch user from DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Apply For a Job

export const applyForJob = async(req,res) => {
    const { jobId } = req.body

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 2. Decode the token (no verification yet)
    const decoded = jwt.decode(token);
    // console.log("Decoded Token:", decoded); // Debug: Check the payload

    // 3. Extract userId (Clerk stores it in `sub`)
    const userId = decoded?.sub;
        console.log("User ID from Token:", userId); // Debug: Check the userId

    try {
        const isAlreadyApplied = await JobApplication.find({jobId,userId})
        if (isAlreadyApplied.length > 0) {
            return res.json({success:false,message:'Already Applied'})
        }
        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({success:false,message:'job not found'})
        }
        await JobApplication.create({
            companyId:jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({success:true,message:'Applied Successfully'})

    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

// Get user applied applications 
export const getUserJobApplications = async(req,res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 2. Decode the token (no verification yet)
    const decoded = jwt.decode(token);
    // console.log("Decoded Token:", decoded); // Debug: Check the payload

    // 3. Extract userId (Clerk stores it in `sub`)
    const userId = decoded?.sub;
        

        const applications = await JobApplication.find({userId})
        .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec();

        if (!applications) {
            return res.json({success:false,message:'No job application found for this user'})
        }
        return res.json({success:true,applications})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

// Update user profile (resume)
export const updateUserResume = async(req,res) => {
    try {
       const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // 2. Decode the token (no verification yet)
    const decoded = jwt.decode(token);
    // console.log("Decoded Token:", decoded); // Debug: Check the payload

    // 3. Extract userId (Clerk stores it in `sub`)
    const userId = decoded?.sub;
        const resumeFile = req.file
         
        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
            console.log("updated");
        }

        await userData.save()

        return res.json({success:true,message:'Resume Updated'})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}