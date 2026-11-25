import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

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

    // 1. التحقق من الحقول المطلوبة
    if (!firstName?.trim()) errors.firstName = "First name is required.";
    if (!lastName?.trim()) errors.lastName = "Last name is required.";
    if (!studentId?.trim()) errors.studentId = "Student ID is required.";
    if (!email?.trim()) errors.email = "Email address is required.";
    if (!phone?.trim()) errors.phone = "Phone number is required.";
    if (!faculty?.trim()) errors.faculty = "Faculty is required.";
    if (!department?.trim()) errors.department = "Department is required.";
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
      user: {
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
      },
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
      user: {
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
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile
export const getProfile = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};
