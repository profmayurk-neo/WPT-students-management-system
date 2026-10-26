import { readFile, writeFile, rename } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { validateStudent } from "./validation.js";

export const listStudents = (students) => [...students];
export const findStudentById = (students, id) =>
  students.find((s) => s.id === id) ?? null;
export const filterStudents = (students, department, semester) =>
  students.filter(
    (s) => s.department === department && s.semester === semester,
  );
export const averageMarks = (s) =>
  s.subjects.length
    ? s.subjects.reduce((sum, x) => sum + x.marks, 0) / s.subjects.length
    : 0;
export const lowAttendance = (students) =>
  students.filter((s) => s.attendance < 75);
export const above80EverySubject = (students) =>
  students.filter(
    (s) => s.subjects.length && s.subjects.every((x) => x.marks > 80),
  );
export const sortByAverage = (students) =>
  [...students].sort((a, b) => averageMarks(b) - averageMarks(a));

export function addStudent(students, student) {
  if (!validateStudent(student)) throw new Error("Invalid student record.");
  if (findStudentById(students, student.id))
    throw new Error("Duplicate student ID.");
  return [...students, student];
}
export function updateStudent(students, id, changes) {
  const old = findStudentById(students, id);
  if (!old) throw new Error("Student not found.");
  const updated = { ...old, ...changes };
  if (!validateStudent(updated)) throw new Error("Updated record is invalid.");
  return students.map((s) => (s.id === id ? updated : s));
}
export function deleteStudent(students, id) {
  if (!findStudentById(students, id)) throw new Error("Student not found.");
  return students.filter((s) => s.id !== id);
}
export async function loadStudents(path) {
  let data;
  try {
    data = JSON.parse(await readFile(path, "utf8"));
  } catch (e) {
    throw new Error(
      e.code === "ENOENT"
        ? "students.json not found."
        : `Could not read JSON: ${e.message}`,
    );
  }
  if (!Array.isArray(data) || !data.every(validateStudent))
    throw new Error("Student data is invalid.");
  if (new Set(data.map((s) => s.id)).size !== data.length)
    throw new Error("Duplicate student IDs found.");
  return data;
}
export async function saveStudents(path, students) {
  if (
    !students.every(validateStudent) ||
    new Set(students.map((s) => s.id)).size !== students.length
  ) {
    throw new Error("Refusing to save invalid or duplicate student data.");
  }
  const temp = `${path}.${randomUUID()}.tmp`;
  await writeFile(temp, `${JSON.stringify(students, null, 2)}\\n`, "utf8");
  await rename(temp, path);
}
