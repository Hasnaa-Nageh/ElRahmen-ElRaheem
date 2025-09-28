const multer = require("multer");
const path = require("path");

// ---------- Doctors ----------
const storageDoc = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/doctors");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-doctor-" + file.fieldname + path.extname(file.originalname)
    );
  },
});

// ---------- Departments ----------
const departmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/departments");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-department-" +
        file.fieldname +
        path.extname(file.originalname)
    );
  },
});

// ---------- Filters ----------
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  }
};

// ---------- Exports ----------
const uploadDoc = multer({
  storage: storageDoc,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

const uploadDepartment = multer({
  storage: departmentStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

module.exports = { uploadDoc, uploadDepartment }; 