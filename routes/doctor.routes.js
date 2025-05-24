import express from 'express';
import {
    registerDoctor,
    getDoctorbyid,
    updateDoctor,
    deleteDoctor,
    uploadAvatar,
    getAllDoctors
} from '../controller/doctor.controller.js'; // Adjust path if your controller is elsewhere


import { authenticateJWT,   } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js'; // For authentication and authorization

const router = express.Router();

// Public route: Register a new doctor
// This route typically should be accessible by an admin or
// perhaps a user themselves if they are registering as a doctor (requires careful design)
// For simplicity, making it public here, but consider who should access this.
router.post('/register', registerDoctor);

// Authenticated and Authorized routes for doctors and admins

// Get all doctors (Accessible by Admin or perhaps any authenticated user depending on requirements)
// Example: Only Admins can view all doctors for management
router.get(
    '/',
    authenticateJWT,
    authorizeRoles('admin'), // Assuming only 'admin' can view all doctors
    getAllDoctors
);

// Get a single doctor by userId
// Accessible by the doctor themselves, or an admin
router.get(
    '/:userId',
    authenticateJWT,
    authorizeRoles('admin', 'doctor', 'user'), // An admin can view any, a doctor can view their own, a user might view public profile
    getDoctorbyid
);

// Update a doctor's profile by userId
// Accessible by the doctor themselves or an admin
router.put(
    '/:userId',
    authenticateJWT,
    authorizeRoles('admin', 'doctor'), // Only 'admin' or the 'doctor' themselves can update
    updateDoctor
);

// Delete a doctor by userId
// Typically restricted to admins only
router.delete(
    '/:userId',
    authenticateJWT,
    authorizeRoles('admin'), // Only 'admin' can delete a doctor
    deleteDoctor
);

// Upload doctor's avatar (requires multer middleware for file processing)
// The ':id' here refers to the Doctor document's MongoDB _id, not the userId
// Accessible by the doctor themselves or an admin
router.post(
    '/avatar/:id',
    authenticateJWT,
    authorizeRoles('admin', 'doctor'), // Only 'admin' or the 'doctor' themselves can upload an avatar
     // 'avatar' must match the field name in your form/FormData
    uploadAvatar
);


export default router;