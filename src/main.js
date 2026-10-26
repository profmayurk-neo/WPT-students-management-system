import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import * as svc from "./studentService.js";

const path = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../data/students.json",
);
try {
  let students = await svc.loadStudents(path);
  console.log("All students:");
  console.table(svc.listStudents(students));
  console.log("Find S1002:", svc.findStudentById(students, "S1002"));
  console.log("Low attendance:");
  console.table(svc.lowAttendance(students));
  console.log("Average marks:");
  console.table(
    students.map((s) => ({
      name: s.fullName,
      average: svc.averageMarks(s).toFixed(2),
    })),
  );
  console.log("Above 80 in every subject:");
  console.table(svc.above80EverySubject(students));
  console.log("Sorted by average:");
  console.table(
    svc
      .sortByAverage(students)
      .map((s) => ({
        name: s.fullName,
        average: svc.averageMarks(s).toFixed(2),
      })),
  );
  students = svc.updateStudent(students, "S1001", {
    email: "aarav.updated@example.com",
  });
  await svc.saveStudents(path, students);
  console.log("Email update saved.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
