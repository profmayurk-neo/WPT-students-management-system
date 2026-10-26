export function validateStudent(s) {
  return Boolean(
    s &&
    typeof s.id === "string" &&
    s.id.trim() &&
    typeof s.fullName === "string" &&
    s.fullName.trim() &&
    typeof s.email === "string" &&
    typeof s.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email) &&
    Number.isInteger(s.age) &&
    s.age > 0 &&
    typeof s.department === "string" &&
    Number.isInteger(s.semester) &&
    s.semester > 0 &&
    Array.isArray(s.subjects) &&
    s.subjects.length > 0 &&
    s.subjects.every(
      (x) =>
        typeof x.name === "string" &&
        Number.isFinite(x.marks) &&
        x.marks >= 0 &&
        x.marks <= 100,
    ) &&
    Number.isFinite(s.attendance) &&
    s.attendance >= 0 &&
    s.attendance <= 100 &&
    typeof s.active === "boolean",
  );
}
