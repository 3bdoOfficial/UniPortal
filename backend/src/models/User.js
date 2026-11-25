import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "employee", "admin"],
      default: "student",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: (val) => {
          if (!/^\+?[\d\s()-]+$/.test(val)) return false;
          const digits = val.replace(/\D/g, "");
          return digits.length >= 7 && digits.length <= 15;
        },
        message: "Please provide a valid phone number (7-15 digits, optional country code)",
      },
    },
    faculty: {
      type: String,
      required: [true, "Faculty is required"],
      trim: true,
      minlength: [2, "Faculty must be at least 2 characters"],
      maxlength: [100, "Faculty cannot exceed 100 characters"],
      match: [
        /^[A-Za-z\u0600-\u06FF\s&'-]+$/,
        "Faculty must contain letters only (numbers are not allowed)",
      ],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      minlength: [2, "Department must be at least 2 characters"],
      maxlength: [100, "Department cannot exceed 100 characters"],
      match: [
        /^[A-Za-z\u0600-\u06FF\s&'-]+$/,
        "Department must contain letters only (numbers are not allowed)",
      ],
    },
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      enum: {
        values: ["First Year", "Second Year", "Third Year", "Fourth Year"],
        message: "Academic year must be First Year, Second Year, Third Year, or Fourth Year",
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
