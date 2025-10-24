import { createCourse, listCourses } from '../models/courseModel.js';


export const create = async (req, res, next) => {
try {
const { code, title, credit, faculty_id } = req.body;
const c = await createCourse({ code, title, credit, faculty_id });
res.status(201).json(c);
} catch (e) { next(e); }
};


export const list = async (req, res, next) => {
try { res.json(await listCourses()); } catch (e) { next(e); }
};