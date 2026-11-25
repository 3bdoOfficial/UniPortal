import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

const NAME_RE = /^[A-Za-z\u0600-\u06FF\s'-]+$/;
const ACADEMIC_TEXT_RE = /^[A-Za-z\u0600-\u06FF\s&'-]+$/;
const EMAIL_RE = /^\S+@\S+\.\S+$/;
const PHONE_RE = /^\+?[\d\s()-]+$/;

const formatUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  studentId: user.studentId,
  email: user.email,
  phone: user.phone,
  faculty: user.faculty,
  department: user.department,
  academicYear: user.academicYear,
  role: user.role,
});

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      studentId,
      email,
      password,
      confirmPassword,
      phone,
      faculty,
      department,
      academicYear,
    } = req.body;

    const errors = {};

    // 1. التحقق من الحقول المطلوبة وصيغة الكلية والقسم
    if (!firstName?.trim()) errors.firstName = "First name is required.";
    if (!lastName?.trim()) errors.lastName = "Last name is required.";
    if (!studentId?.trim()) errors.studentId = "Student ID is required.";
    if (!email?.trim()) errors.email = "Email address is required.";
    if (!phone?.trim()) errors.phone = "Phone number is required.";

    if (!faculty?.trim()) {
      errors.faculty = "Faculty is required.";
    } else if (!ACADEMIC_TEXT_RE.test(faculty.trim())) {
      errors.faculty = "Faculty must contain letters only (numbers are not allowed).";
    }

    if (!department?.trim()) {
      errors.department = "Department is required.";
    } else if (!ACADEMIC_TEXT_RE.test(department.trim())) {
      errors.department = "Department must contain letters only (numbers are not allowed).";
    }

    if (!academicYear?.trim())
      errors.academicYear = "Academic year is required.";
    if (!password) errors.password = "Password is required.";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // 2. التحقق من تطابق كلمتي المرور
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
        errors: { confirmPassword: "Passwords do not match." },
      });
    }

    // 3. التحقق من طول كلمة المرور
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
        errors: { password: "Password must be at least 8 characters." },
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = studentId.trim();

    // 4. التحقق من عدم تكرار البريد الإلكتروني
    const emailExists = await User.findOne({ email: cleanEmail });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "This email address is already registered.",
        errors: { email: "This email address is already registered." },
      });
    }

    // 5. التحقق من عدم تكرار الرقم الجامعي
    const studentIdExists = await User.findOne({ studentId: cleanStudentId });
    if (studentIdExists) {
      return res.status(409).json({
        success: false,
        message: "This Student ID is already registered.",
        errors: { studentId: "This Student ID is already registered." },
      });
    }

    // 6. تشفير كلمة المرور بشكل صريح قبل الحفظ
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. إنشاء المستخدم في قاعدة البيانات
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      studentId: cleanStudentId,
      email: cleanEmail,
      phone: phone.trim(),
      faculty: faculty.trim(),
      department: department.trim(),
      academicYear: academicYear.trim(),
      password: hashedPassword,
      role: "student",
    });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "7d",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "7d",
    });

    return res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  return res.json({
    success: true,
    user: formatUser(req.user),
  });
};

// PUT /api/auth/profile
// مسموح بتعديل البيانات الشخصية الأربعة فقط (firstName, lastName, email, phone)
// والبيانات الأكاديمية (studentId, faculty, department, academicYear) غير قابلة للتعديل
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const updates = {};
    const errors = {};

    if (firstName !== undefined) {
      const val = String(firstName).trim();
      if (!val || val.length < 2 || val.length > 50) {
        errors.firstName = "First name must be between 2 and 50 characters.";
      } else if (!NAME_RE.test(val)) {
        errors.firstName = "First name can only contain letters.";
      } else {
        updates.firstName = val;
      }
    }

    if (lastName !== undefined) {
      const val = String(lastName).trim();
      if (!val || val.length < 2 || val.length > 50) {
        errors.lastName = "Last name must be between 2 and 50 characters.";
      } else if (!NAME_RE.test(val)) {
        errors.lastName = "Last name can only contain letters.";
      } else {
        updates.lastName = val;
      }
    }

    if (email !== undefined) {
      const val = String(email).trim().toLowerCase();
      if (!val || !EMAIL_RE.test(val)) {
        errors.email = "Please provide a valid email address.";
      } else {
        const existingUser = await User.findOne({
          email: val,
          _id: { $ne: req.user._id },
        });
        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "This email address is already in use.",
            errors: { email: "This email address is already in use." },
          });
        }
        updates.email = val;
      }
    }

    if (phone !== undefined) {
      const val = String(phone).trim();
      const digits = val.replace(/\D/g, "");
      if (!val || !PHONE_RE.test(val) || digits.length < 7 || digits.length > 15) {
        errors.phone =
          "Please provide a valid phone number (7-15 digits, optional country code).";
      } else {
        updates.phone = val;
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: Object.values(errors)[0],
        errors,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: formatUser(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};
