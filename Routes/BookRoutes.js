const express = require("express");
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const { verifyJwt } = require("../Middlewares/verifyJWT");
const { verifyRoles } = require("../Middlewares/verifyRoles");
const { createNewBook } = require("../Controllers/bookController");
const { editBook, getAllBooks } = require("../Controllers/bookController");
const { deleteBook } = require("../Controllers/bookController");
const { getOneBook } = require("../Controllers/bookController");
const ROLES_LIST = require("../Config/rolesList");
const { multerStorage } = require("../Middlewares/multer");

router.get("/", getAllBooks);
router.post("/add", verifyJwt, verifyRoles(ROLES_LIST.Admin), multerStorage, createNewBook);
router.put("/updatebook/:id", verifyJwt, verifyRoles(ROLES_LIST.Admin), multerStorage, editBook);
router.delete("/deletebook/:id", verifyJwt, verifyRoles(ROLES_LIST.Admin), deleteBook);
router.get("/:id", getOneBook);

module.exports = router;
