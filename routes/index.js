import express from "express"
const router = express.Router();
import { sql } from "../db.js"

// Get all batches (from recap table)
router.get(`/batches`, async (req, res) => {
    const batches = await sql`SELECT rid, semester, year, class FROM recap;`
    res.status(200).json(batches);
});

// Get students for a batch (from student and marks tables)
router.get(`/students`, async (req, res) => {
    const { batch } = req.query;
    const students = await sql`
        SELECT DISTINCT s.regno, s.name
        FROM student s
        JOIN marks m ON s.regno = m.regno
        WHERE m.rid = ${batch};
    `;
    res.status(200).json(students);
});

// Get all subjects (from course table)
router.get(`/subjects`, async (req, res) => {
    const subjects = await sql`SELECT cid, code, title FROM course;`
    res.status(200).json(subjects);
});

// Get marks for students in a batch (from marks table)
router.get(`/marks`, async (req, res) => {
    const { batch } = req.query;
    const marks = await sql`
        SELECT m.mid, m.hid, m.regno, m.marks, m.rid, h.head
        FROM marks m
        JOIN head h ON m.hid = h.hid
        WHERE m.rid = ${batch};
    `;
    res.status(200).json(marks);
});

// Get grade mapping (from grade table)
router.get(`/grades`, async (req, res) => {
    const grades = await sql`SELECT * FROM grade;`
    res.status(200).json(grades);
});

export default router;