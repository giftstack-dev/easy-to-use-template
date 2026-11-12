/**
 * Frontdoor HTML Templates - Varsity (University Portal) Engine
 * ==============================================================
 * Handles CSV parsing, validation, 5-point & 4-point grading presets,
 * exact integer-arithmetic GPA/CGPA computation, repeat policies,
 * carryover tracking, target degree planning, rejection-sampled access codes,
 * Web Worker pool PBKDF2-SHA-256 (120k) + AES-GCM-256 encryption,
 * single-file vs sharded (data/{xx}.json) packaging, A4 access slips,
 * codes.csv, robots.txt, and deployment README generation.
 */

import {
  AcademicStandingRules,
  DegreeClassBand,
  EncryptedStudentRecord,
  GradingPresetId,
  PortalDataBundle,
  RepeatPolicy,
  TemplateConfig,
  UniversityGradeBand,
} from './types.ts';
import { escapeHtml, getInitials, validateImageUrl } from './shared.ts';

export const PBKDF2_ITERATIONS = 120000;
export const SINGLE_FILE_STUDENT_LIMIT = 800;
export const MAX_STUDENTS = 10000;
export const MAX_RESULT_ROWS = 250000;
export const ACCESS_CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const PRESET_5_POINT: {
  label: string;
  caMax: number;
  examMax: number;
  passMark: number;
  requiredUnits: number;
  gradeBands: UniversityGradeBand[];
  degreeBands: DegreeClassBand[];
  standingRules: AcademicStandingRules;
} = {
  label: 'Nigerian university (5-point)',
  caMax: 30,
  examMax: 70,
  passMark: 40,
  requiredUnits: 120,
  gradeBands: [
    { grade: 'A', min: 70, max: 100, point: 5.0, remark: 'Excellent' },
    { grade: 'B', min: 60, max: 69, point: 4.0, remark: 'Very Good' },
    { grade: 'C', min: 50, max: 59, point: 3.0, remark: 'Good' },
    { grade: 'D', min: 45, max: 49, point: 2.0, remark: 'Fair' },
    { grade: 'E', min: 40, max: 44, point: 1.0, remark: 'Pass' },
    { grade: 'F', min: 0, max: 39, point: 0.0, remark: 'Fail' },
  ],
  degreeBands: [
    { label: 'First Class', min: 4.5, max: 5.0 },
    { label: 'Second Class Upper', min: 3.5, max: 4.49 },
    { label: 'Second Class Lower', min: 2.4, max: 3.49 },
    { label: 'Third Class', min: 1.5, max: 2.39 },
    { label: 'Pass', min: 1.0, max: 1.49 },
  ],
  standingRules: {
    goodStandingMin: 1.5,
    senateThreshold: 1.0,
  },
};

export const PRESET_4_POINT: {
  label: string;
  caMax: number;
  examMax: number;
  passMark: number;
  requiredUnits: number;
  gradeBands: UniversityGradeBand[];
  degreeBands: DegreeClassBand[];
  standingRules: AcademicStandingRules;
} = {
  label: 'Polytechnic / College (4-point)',
  caMax: 30,
  examMax: 70,
  passMark: 40,
  requiredUnits: 120,
  gradeBands: [
    { grade: 'A', min: 75, max: 100, point: 4.0, remark: 'Distinction' },
    { grade: 'AB', min: 70, max: 74, point: 3.5, remark: 'Upper Credit' },
    { grade: 'B', min: 65, max: 69, point: 3.25, remark: 'Credit' },
    { grade: 'BC', min: 60, max: 64, point: 3.0, remark: 'Credit' },
    { grade: 'C', min: 55, max: 59, point: 2.75, remark: 'Merit' },
    { grade: 'CD', min: 50, max: 54, point: 2.5, remark: 'Merit' },
    { grade: 'D', min: 45, max: 49, point: 2.25, remark: 'Pass' },
    { grade: 'E', min: 40, max: 44, point: 2.0, remark: 'Pass' },
    { grade: 'F', min: 0, max: 39, point: 0.0, remark: 'Fail' },
  ],
  degreeBands: [
    { label: 'Distinction', min: 3.5, max: 4.0 },
    { label: 'Upper Credit', min: 3.0, max: 3.49 },
    { label: 'Lower Credit', min: 2.5, max: 2.99 },
    { label: 'Pass', min: 2.0, max: 2.49 },
  ],
  standingRules: {
    goodStandingMin: 2.0,
    senateThreshold: 1.0,
  },
};

export function getPresetConfig(preset: GradingPresetId) {
  return preset === '4-point' ? PRESET_4_POINT : PRESET_5_POINT;
}

export type SemesterName = 'First' | 'Second';

export interface RawUniversityStudent {
  matricNumber: string;
  normalizedMatric: string;
  fullName: string;
  faculty: string;
  department: string;
  programme: string;
  currentLevel: string;
  entrySession: string;
  gender: string;
  email: string;
  phone: string;
  rowNumber: number;
}

export interface RawUniversityResult {
  matricNumber: string;
  normalizedMatric: string;
  session: string;
  semester: SemesterName;
  courseCode: string;
  courseTitle: string;
  units: number;
  level: string;
  caScore: number | null;
  examScore: number | null;
  totalScore: number;
  rowNumber: number;
}

export interface CsvValidationIssue {
  file: 'students.csv' | 'results.csv';
  row: number;
  message: string;
}

export interface UniversityCsvValidationReport {
  valid: boolean;
  errors: CsvValidationIssue[];
  warnings: CsvValidationIssue[];
  students: RawUniversityStudent[];
  results: RawUniversityResult[];
  summary: {
    studentsCount: number;
    facultiesCount: number;
    departmentsCount: number;
    sessionsCount: number;
    sessions: string[];
    resultRowsCount: number;
    outputMode: 'single' | 'sharded';
  };
}

export interface ComputedCourseRow {
  courseCode: string;
  courseTitle: string;
  units: number;
  ca: number | null;
  exam: number | null;
  total: number;
  grade: string;
  gradePoint: number;
  creditPoint: number;
  isCarryover: boolean;
  isRepeat: boolean;
}

export interface ComputedSemesterReport {
  session: string;
  semester: SemesterName;
  level: string;
  courses: ComputedCourseRow[];
  tnu: number;
  tcp: number;
  gpa: number;
  ctnu: number;
  ctcp: number;
  cgpa: number;
  unitsEarnedToDate: number;
  standing: string;
  degreeClass: string;
}

export interface CarryoverItem {
  courseCode: string;
  courseTitle: string;
  units: number;
  failedSession: string;
  failedSemester: SemesterName;
  score: number;
}

export interface UniversityStudentPayload {
  matricNumber: string;
  normalizedMatric: string;
  fullName: string;
  faculty: string;
  department: string;
  programme: string;
  currentLevel: string;
  entrySession: string;
  gender?: string;
  email?: string;
  phone?: string;
  sessions: string[];
  semestersBySession: Record<string, Partial<Record<SemesterName, ComputedSemesterReport>>>;
  chronologicalSemesters: Array<{
    session: string;
    semester: SemesterName;
    gpa: number;
    cgpa: number;
    tnu: number;
    tcp: number;
    level: string;
  }>;
  latestSummary: {
    session: string;
    semester: SemesterName;
    gpa: number;
    cgpa: number;
    ctnu: number;
    ctcp: number;
    unitsEarned: number;
    requiredUnits: number;
    standing: string;
    degreeClass: string;
  } | null;
  unresolvedCarryovers: CarryoverItem[];
}

export interface UniversityAccessRecord {
  matricNumber: string;
  normalizedMatric: string;
  fullName: string;
  faculty: string;
  department: string;
  programme: string;
  currentLevel: string;
  accessCode: string;
}

export const DEMO_CREDENTIALS = {
  matricNumber: 'GSU/22/CSC/0001',
  accessCode: '23456-789AB',
};

export const DEMO_ACCESS_CODES: Record<string, string> = {
  GSU22CSC0001: '23456-789AB',
  GSU22CSC0002: '34567-89ABC',
  GSU23CSC0003: '45678-9ABCD',
  GSU24CSC0004: '56789-ABCDE',
  GSU22ECO0005: '6789A-BCDEF',
  GSU23ECO0006: '789AB-CDEFG',
  GSU23ECO0007: '89ABC-DEFGH',
  GSU24ECO0008: '9ABCD-EFGHJ',
  GSU22ENG0009: 'ABCDE-FGHJK',
  GSU23ENG0010: 'BCDEF-GHJKL',
  GSU24ENG0011: 'CDEFG-HJKLM',
  GSU24ENG0012: 'DEFGH-JKLMN',
};

export function normalizeMatric(raw: string): string {
  return (raw || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function normalizeAccessCode(raw: string): string {
  return (raw || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export const DEMO_STUDENTS_CSV = [
  'matric_number,full_name,faculty,department,programme,current_level,entry_session,gender,email,phone',
  'GSU/22/CSC/0001,Chinedu Okafor,Faculty of Science,Department of Computer Science,B.Sc. Computer Science,300,2022/2023,Male,chinedu.okafor@example.com,08031110001',
  'GSU/22/CSC/0002,Aisha Bello,Faculty of Science,Department of Computer Science,B.Sc. Computer Science,300,2022/2023,Female,aisha.bello@example.com,08031110002',
  'GSU/23/CSC/0003,Oluwatobi Adeyemi,Faculty of Science,Department of Computer Science,B.Sc. Computer Science,200,2023/2024,Male,oluwatobi.adeyemi@example.com,08031110003',
  'GSU/24/CSC/0004,Ngozi Eze,Faculty of Science,Department of Computer Science,B.Sc. Computer Science,100,2024/2025,Female,ngozi.eze@example.com,08031110004',
  'GSU/22/ECO/0005,Ibrahim Danjuma,Faculty of Social Sciences,Department of Economics,B.Sc. Economics,300,2022/2023,Male,ibrahim.danjuma@example.com,08031110005',
  'GSU/23/ECO/0006,Favour Oghenekevwe,Faculty of Social Sciences,Department of Economics,B.Sc. Economics,200,2023/2024,Female,favour.oghenekevwe@example.com,08031110006',
  'GSU/23/ECO/0007,Emeka Nwosu,Faculty of Social Sciences,Department of Economics,B.Sc. Economics,200,2023/2024,Male,emeka.nwosu@example.com,08031110007',
  'GSU/24/ECO/0008,Zainab Abdullahi,Faculty of Social Sciences,Department of Economics,B.Sc. Economics,100,2024/2025,Female,zainab.abdullahi@example.com,08031110008',
  'GSU/22/ENG/0009,Kemi Adesina,Faculty of Arts,Department of English,B.A. English,300,2022/2023,Female,kemi.adesina@example.com,08031110009',
  'GSU/23/ENG/0010,Sadiq Umar,Faculty of Arts,Department of English,B.A. English,200,2023/2024,Male,sadiq.umar@example.com,08031110010',
  'GSU/24/ENG/0011,Blessing Okoro,Faculty of Arts,Department of English,B.A. English,100,2024/2025,Female,blessing.okoro@example.com,08031110011',
  'GSU/24/ENG/0012,Tunde Ogunleye,Faculty of Arts,Department of English,B.A. English,100,2024/2025,Male,tunde.ogunleye@example.com,08031110012',
].join('\n');

interface CourseTemplate {
  code: string;
  title: string;
  units: number;
}

const DEPT_CURRICULUM: Record<string, Record<string, Record<SemesterName, CourseTemplate[]>>> = {
  'Department of Computer Science': {
    '100': {
      First: [
        { code: 'CSC 101', title: 'Introduction to Computer Science', units: 3 },
        { code: 'CSC 103', title: 'Problem Solving & Algorithms', units: 3 },
        { code: 'MTH 101', title: 'Elementary Mathematics I', units: 3 },
        { code: 'PHY 101', title: 'General Physics I', units: 3 },
        { code: 'STA 111', title: 'Descriptive Statistics', units: 2 },
        { code: 'GST 101', title: 'Use of English I', units: 2 },
        { code: 'GST 103', title: 'Nigerian Peoples & Culture', units: 2 },
      ],
      Second: [
        { code: 'CSC 102', title: 'Introduction to Programming', units: 3 },
        { code: 'CSC 104', title: 'Digital Logic Design', units: 3 },
        { code: 'MTH 102', title: 'Elementary Mathematics II', units: 3 },
        { code: 'PHY 102', title: 'General Physics II', units: 3 },
        { code: 'STA 112', title: 'Probability I', units: 2 },
        { code: 'GST 102', title: 'Use of English II', units: 2 },
        { code: 'GST 104', title: 'Philosophy & Logic', units: 2 },
      ],
    },
    '200': {
      First: [
        { code: 'CSC 201', title: 'Computer Programming II (OOP)', units: 3 },
        { code: 'CSC 203', title: 'Discrete Structures', units: 3 },
        { code: 'CSC 205', title: 'Computer Architecture', units: 3 },
        { code: 'MTH 201', title: 'Mathematical Methods I', units: 3 },
        { code: 'STA 211', title: 'Statistical Inference', units: 2 },
        { code: 'GST 201', title: 'Entrepreneurship Studies I', units: 2 },
        { code: 'CSC 207', title: 'Operating Systems Fundamentals', units: 2 },
      ],
      Second: [
        { code: 'CSC 202', title: 'Data Structures & Algorithms', units: 3 },
        { code: 'CSC 204', title: 'Database Management Systems', units: 3 },
        { code: 'CSC 206', title: 'Software Engineering I', units: 3 },
        { code: 'MTH 204', title: 'Linear Algebra', units: 3 },
        { code: 'CSC 208', title: 'Web Application Development', units: 2 },
        { code: 'GST 202', title: 'Peace & Conflict Resolution', units: 2 },
        { code: 'CSC 210', title: 'Assembly Language Programming', units: 2 },
      ],
    },
    '300': {
      First: [
        { code: 'CSC 301', title: 'Structured Programming & Compilers', units: 3 },
        { code: 'CSC 303', title: 'Object-Oriented Analysis & Design', units: 3 },
        { code: 'CSC 305', title: 'Computer Networks & Security', units: 3 },
        { code: 'CSC 307', title: 'Numerical Analysis', units: 3 },
        { code: 'CSC 309', title: 'Algorithms & Complexity', units: 3 },
        { code: 'CSC 311', title: 'Human-Computer Interaction', units: 2 },
        { code: 'GST 301', title: 'Entrepreneurship Venture Creation', units: 2 },
      ],
      Second: [
        { code: 'CSC 302', title: 'Systems Analysis & Design', units: 3 },
        { code: 'CSC 304', title: 'Artificial Intelligence', units: 3 },
        { code: 'CSC 306', title: 'SIWES Industrial Training', units: 4 },
        { code: 'CSC 308', title: 'Distributed Computing', units: 3 },
        { code: 'CSC 310', title: 'Research Methodology in Computing', units: 2 },
        { code: 'CSC 312', title: 'Cloud Infrastructure Basics', units: 2 },
        { code: 'CSC 314', title: 'Cybersecurity Operations', units: 2 },
      ],
    },
  },
  'Department of Economics': {
    '100': {
      First: [
        { code: 'ECO 101', title: 'Principles of Microeconomics', units: 3 },
        { code: 'ECO 103', title: 'Introduction to Mathematics for Economists', units: 3 },
        { code: 'ACC 101', title: 'Principles of Accounting I', units: 3 },
        { code: 'BUS 101', title: 'Introduction to Business', units: 2 },
        { code: 'STA 111', title: 'Descriptive Statistics', units: 2 },
        { code: 'GST 101', title: 'Use of English I', units: 2 },
        { code: 'GST 103', title: 'Nigerian Peoples & Culture', units: 2 },
      ],
      Second: [
        { code: 'ECO 102', title: 'Principles of Macroeconomics', units: 3 },
        { code: 'ECO 104', title: 'Statistics for Economists I', units: 3 },
        { code: 'ACC 102', title: 'Principles of Accounting II', units: 3 },
        { code: 'POL 102', title: 'Introduction to Political Science', units: 2 },
        { code: 'ECO 106', title: 'Nigerian Economic History', units: 2 },
        { code: 'GST 102', title: 'Use of English II', units: 2 },
        { code: 'GST 104', title: 'Philosophy & Logic', units: 2 },
      ],
    },
    '200': {
      First: [
        { code: 'ECO 201', title: 'Microeconomic Theory I', units: 3 },
        { code: 'ECO 203', title: 'Macroeconomic Theory I', units: 3 },
        { code: 'ECO 205', title: 'Mathematical Economics I', units: 3 },
        { code: 'ECO 207', title: 'History of Economic Thought', units: 2 },
        { code: 'ECO 209', title: 'Applied Statistics for Economics', units: 3 },
        { code: 'GST 201', title: 'Entrepreneurship Studies I', units: 2 },
        { code: 'FIN 201', title: 'Money & Banking', units: 2 },
      ],
      Second: [
        { code: 'ECO 202', title: 'Microeconomic Theory II', units: 3 },
        { code: 'ECO 204', title: 'Macroeconomic Theory II', units: 3 },
        { code: 'ECO 206', title: 'Public Sector Economics', units: 3 },
        { code: 'ECO 208', title: 'Development Economics I', units: 2 },
        { code: 'ECO 210', title: 'Structure of the Nigerian Economy', units: 2 },
        { code: 'GST 202', title: 'Peace & Conflict Resolution', units: 2 },
        { code: 'FIN 202', title: 'Corporate Finance', units: 2 },
      ],
    },
    '300': {
      First: [
        { code: 'ECO 301', title: 'Intermediate Microeconomics', units: 3 },
        { code: 'ECO 303', title: 'Intermediate Macroeconomics', units: 3 },
        { code: 'ECO 305', title: 'Econometrics I', units: 3 },
        { code: 'ECO 307', title: 'International Trade', units: 3 },
        { code: 'ECO 309', title: 'Monetary Economics', units: 2 },
        { code: 'ECO 311', title: 'Labour Economics', units: 2 },
        { code: 'GST 301', title: 'Entrepreneurship Venture Creation', units: 2 },
      ],
      Second: [
        { code: 'ECO 302', title: 'Econometrics II', units: 3 },
        { code: 'ECO 304', title: 'International Finance', units: 3 },
        { code: 'ECO 306', title: 'Project Evaluation', units: 3 },
        { code: 'ECO 308', title: 'Research Methodology in Economics', units: 2 },
        { code: 'ECO 310', title: 'Industrial Economics', units: 2 },
        { code: 'ECO 312', title: 'Environmental Economics', units: 2 },
        { code: 'ECO 314', title: 'Public Debt & Fiscal Policy', units: 2 },
      ],
    },
  },
  'Department of English': {
    '100': {
      First: [
        { code: 'ENG 101', title: 'Introduction to English Grammar', units: 3 },
        { code: 'ENG 103', title: 'Spoken English & Phonetics', units: 3 },
        { code: 'LIT 101', title: 'Introduction to Prose Fiction', units: 3 },
        { code: 'LIT 103', title: 'Introduction to Poetry', units: 2 },
        { code: 'HIS 101', title: 'African Oral Literature', units: 2 },
        { code: 'GST 101', title: 'Use of English I', units: 2 },
        { code: 'GST 103', title: 'Nigerian Peoples & Culture', units: 2 },
      ],
      Second: [
        { code: 'ENG 102', title: 'Basic English Composition', units: 3 },
        { code: 'ENG 104', title: 'History of the English Language', units: 3 },
        { code: 'LIT 102', title: 'Introduction to Drama', units: 3 },
        { code: 'LIT 104', title: 'Nigerian Literature in English', units: 2 },
        { code: 'LIN 102', title: 'Introduction to General Linguistics', units: 2 },
        { code: 'GST 102', title: 'Use of English II', units: 2 },
        { code: 'GST 104', title: 'Philosophy & Logic', units: 2 },
      ],
    },
    '200': {
      First: [
        { code: 'ENG 201', title: 'English Morphology & Syntax', units: 3 },
        { code: 'ENG 203', title: 'Phonology of English', units: 3 },
        { code: 'LIT 201', title: 'African Novel & Short Story', units: 3 },
        { code: 'LIT 203', title: 'Elizabethan & Jacobean Drama', units: 2 },
        { code: 'ENG 205', title: 'Creative Writing Workshop I', units: 2 },
        { code: 'GST 201', title: 'Entrepreneurship Studies I', units: 2 },
        { code: 'ENG 207', title: 'Advanced Academic Writing', units: 2 },
      ],
      Second: [
        { code: 'ENG 202', title: 'Semantics & Pragmatics', units: 3 },
        { code: 'ENG 204', title: 'Varieties of English', units: 3 },
        { code: 'LIT 202', title: 'Modern African Poetry', units: 3 },
        { code: 'LIT 204', title: 'Literary Criticism I', units: 2 },
        { code: 'ENG 206', title: 'Editorial & Publishing Practice', units: 2 },
        { code: 'GST 202', title: 'Peace & Conflict Resolution', units: 2 },
        { code: 'ENG 208', title: 'Discourse Analysis', units: 2 },
      ],
    },
    '300': {
      First: [
        { code: 'ENG 301', title: 'Sociolinguistics', units: 3 },
        { code: 'ENG 303', title: 'Stylistics & Rhetoric', units: 3 },
        { code: 'LIT 301', title: 'West African Drama', units: 3 },
        { code: 'LIT 303', title: 'Caribbean & Diaspora Literature', units: 2 },
        { code: 'ENG 305', title: 'Psycholinguistics', units: 2 },
        { code: 'ENG 307', title: 'Media & Communication English', units: 2 },
        { code: 'GST 301', title: 'Entrepreneurship Venture Creation', units: 2 },
      ],
      Second: [
        { code: 'ENG 302', title: 'Applied English Linguistics', units: 3 },
        { code: 'ENG 304', title: 'English in Nigeria', units: 3 },
        { code: 'LIT 302', title: 'Contemporary Feminist Literature', units: 3 },
        { code: 'ENG 306', title: 'Research Methods in English Studies', units: 3 },
        { code: 'ENG 308', title: 'Technical & Business Writing', units: 2 },
        { code: 'LIT 304', title: 'Comparative Literature', units: 2 },
        { code: 'ENG 310', title: 'Translation & Interpretation', units: 2 },
      ],
    },
  },
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generates realistic seeded scores across 3 sessions (2023/2024, 2024/2025, 2025/2026).
 * Includes repeated failed courses passed later (e.g., GSU/22/CSC/0001 fails CSC 102 in 2023/2024 First,
 * repeats and passes CSC 102 in 2024/2025 First; plus an unresolved carryover MTH 204 in 2024/2025 Second;
 * and leaves 2025/2026 Second empty so "No results yet" disabled picker state is verified).
 */
export const DEMO_RESULTS_CSV: string = (() => {
  const rand = mulberry32(20261112);
  const rows: string[] = [
    'matric_number,session,semester,course_code,course_title,units,level,ca_score,exam_score',
  ];
  const studentRows = parseCsv(DEMO_STUDENTS_CSV).slice(1);
  const allSessions = ['2023/2024', '2024/2025', '2025/2026'];

  studentRows.forEach((cols, sIdx) => {
    const matric = cols[0];
    const dept = cols[3];
    const currentLevelNum = parseInt(cols[5], 10);
    const entrySession = cols[6];
    const entryStartYear = parseInt(entrySession.split('/')[0], 10);

    // Performance tier per student so cohort spans First Class -> Probation naturally
    const tierOffsets = [10, 14, 6, -4, 8, 2, -9, 11, 13, 3, -6, 7];
    const offset = tierOffsets[sIdx % tierOffsets.length];

    allSessions.forEach((session) => {
      const sessYear = parseInt(session.split('/')[0], 10);
      if (sessYear < entryStartYear) return;
      const levelForSess = Math.min(currentLevelNum, (sessYear - entryStartYear + 1) * 100);
      const levelStr = String(levelForSess);
      const curriculum = DEPT_CURRICULUM[dept]?.[levelStr];
      if (!curriculum) return;

      (['First', 'Second'] as SemesterName[]).forEach((sem) => {
        // Leave 2025/2026 Second empty so the disabled "No results yet" picker state works cleanly
        if (session === '2025/2026' && sem === 'Second') return;

        const courses = curriculum[sem].slice();

        // Inject realistic carryover & repeat scenarios
        if (matric === 'GSU/22/CSC/0001' && session === '2024/2025' && sem === 'First') {
          // Repeats CSC 102 failed in 2023/2024 First and passes it
          courses.push({ code: 'CSC 102', title: 'Introduction to Programming', units: 3 });
        }
        if (matric === 'GSU/22/ECO/0005' && session === '2024/2025' && sem === 'Second') {
          courses.push({ code: 'ECO 104', title: 'Statistics for Economists I', units: 3 });
        }

        courses.forEach((c) => {
          let targetTotal: number;
          if (matric === 'GSU/22/CSC/0001' && session === '2023/2024' && sem === 'First' && c.code === 'CSC 102') {
            // Intentional initial failure in CSC 102 (repeated in 2024/2025 First)
            targetTotal = 32;
          } else if (matric === 'GSU/22/CSC/0001' && session === '2024/2025' && sem === 'First' && c.code === 'CSC 102') {
            // Repeat attempt passes cleanly with B
            targetTotal = 66;
          } else if (matric === 'GSU/22/CSC/0001' && session === '2024/2025' && sem === 'Second' && c.code === 'MTH 204') {
            // Unresolved carryover shown in Carryovers block
            targetTotal = 34;
          } else if (matric === 'GSU/22/ECO/0005' && session === '2023/2024' && sem === 'Second' && c.code === 'ECO 104') {
            targetTotal = 31;
          } else if (matric === 'GSU/22/ECO/0005' && session === '2024/2025' && sem === 'Second' && c.code === 'ECO 104') {
            targetTotal = 61;
          } else {
            // Weighted realistic score distribution (mostly A-C, occasional D/E, rare F)
            const r = rand();
            const base = r < 0.04 ? 32 : r < 0.14 ? 44 : r < 0.35 ? 55 : r < 0.72 ? 64 : 76;
            const jitter = Math.floor(rand() * 9) - 3;
            targetTotal = Math.max(22, Math.min(96, base + offset + jitter));
          }

          const ca = Math.min(30, Math.max(6, Math.round(targetTotal * 0.3)));
          const exam = Math.min(70, Math.max(10, targetTotal - ca));
          rows.push(`${matric},${session},${sem},${c.code},${c.title},${c.units},${levelStr},${ca},${exam}`);
        });
      });
    });
  });

  return rows.join('\n');
})();

/**
 * Robust built-in CSV parser supporting UTF-8 BOM, CRLF/LF/CR, quoted fields, commas, newlines, and "".
 */
export function parseCsv(text: string): string[][] {
  if (!text) return [];
  const clean = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const next = clean[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field.trim());
      field = '';
    } else if (ch === '\r' && next === '\n') {
      row.push(field.trim());
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
      field = '';
      i++;
    } else if (ch === '\n' || ch === '\r') {
      row.push(field.trim());
      if (row.some((c) => c !== '')) rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  row.push(field.trim());
  if (row.some((c) => c !== '')) rows.push(row);
  return rows;
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, '_');
}

export function normalizeSemester(raw: string): SemesterName | null {
  const v = (raw || '').trim().toLowerCase().replace(/\s+/g, ' ');
  if (v === 'first' || v === 'first semester' || v === '1' || v === '1st' || v === '1st semester') {
    return 'First';
  }
  if (v === 'second' || v === 'second semester' || v === '2' || v === '2nd' || v === '2nd semester') {
    return 'Second';
  }
  return null;
}

export function validateUniversityCsvs(
  studentsCsv: string,
  resultsCsv: string,
  caMax = 30,
  examMax = 70
): UniversityCsvValidationReport {
  const errors: CsvValidationIssue[] = [];
  const warnings: CsvValidationIssue[] = [];
  const students: RawUniversityStudent[] = [];
  const results: RawUniversityResult[] = [];
  const maxTotal = caMax + examMax;

  const studentRows = parseCsv(studentsCsv);
  const resultRows = parseCsv(resultsCsv);

  // 1. Validate students.csv
  const studentMap = new Map<string, RawUniversityStudent>();
  if (studentRows.length < 2) {
    errors.push({
      file: 'students.csv',
      row: 1,
      message: 'students.csv must contain a header row and at least one student.',
    });
  } else {
    const headers = studentRows[0].map(normalizeHeader);
    const reqCols = ['matric_number', 'full_name', 'faculty', 'department', 'programme', 'current_level'];
    const idx: Record<string, number> = {};
    for (const col of reqCols) {
      const pos = headers.indexOf(col);
      if (pos === -1) {
        errors.push({
          file: 'students.csv',
          row: 1,
          message: `Missing required column "${col}".`,
        });
      } else {
        idx[col] = pos;
      }
    }
    const optEntry = headers.indexOf('entry_session');
    const optGender = headers.indexOf('gender');
    const optEmail = headers.indexOf('email');
    const optPhone = headers.indexOf('phone');

    if (studentRows.length - 1 > MAX_STUDENTS) {
      errors.push({
        file: 'students.csv',
        row: MAX_STUDENTS + 2,
        message: `Too many students (${studentRows.length - 1}). Maximum supported is ${MAX_STUDENTS.toLocaleString()}.`,
      });
    }

    if (Object.keys(idx).length === reqCols.length) {
      for (let r = 1; r < studentRows.length; r++) {
        const cols = studentRows[r];
        const rowNum = r + 1;
        const matricNumber = (cols[idx.matric_number] || '').trim();
        const norm = normalizeMatric(matricNumber);
        const fullName = (cols[idx.full_name] || '').trim();
        const faculty = (cols[idx.faculty] || '').trim();
        const department = (cols[idx.department] || '').trim();
        const programme = (cols[idx.programme] || '').trim();
        const currentLevel = (cols[idx.current_level] || '').trim();

        if (!norm) {
          errors.push({ file: 'students.csv', row: rowNum, message: 'Blank or invalid matric_number.' });
          continue;
        }
        if (!fullName) {
          errors.push({ file: 'students.csv', row: rowNum, message: `Blank full_name for ${matricNumber}.` });
          continue;
        }
        if (!faculty || !department || !programme) {
          errors.push({
            file: 'students.csv',
            row: rowNum,
            message: `Missing faculty, department, or programme for ${matricNumber}.`,
          });
          continue;
        }
        if (!currentLevel) {
          errors.push({ file: 'students.csv', row: rowNum, message: `Blank current_level for ${matricNumber}.` });
          continue;
        }
        if (studentMap.has(norm)) {
          errors.push({
            file: 'students.csv',
            row: rowNum,
            message: `Duplicate matric_number "${matricNumber}" (matches existing student after normalization).`,
          });
          continue;
        }

        const st: RawUniversityStudent = {
          matricNumber,
          normalizedMatric: norm,
          fullName,
          faculty,
          department,
          programme,
          currentLevel,
          entrySession: optEntry >= 0 ? (cols[optEntry] || '').trim() : '',
          gender: optGender >= 0 ? (cols[optGender] || '').trim() : '',
          email: optEmail >= 0 ? (cols[optEmail] || '').trim() : '',
          phone: optPhone >= 0 ? (cols[optPhone] || '').trim() : '',
          rowNumber: rowNum,
        };
        studentMap.set(norm, st);
        students.push(st);
      }
    }
  }

  // 2. Validate results.csv
  if (resultRows.length < 2) {
    errors.push({
      file: 'results.csv',
      row: 1,
      message: 'results.csv must contain a header row and at least one course result row.',
    });
  } else {
    const headers = resultRows[0].map(normalizeHeader);
    const reqCols = ['matric_number', 'session', 'semester', 'course_code', 'course_title', 'units'];
    const idx: Record<string, number> = {};
    for (const col of reqCols) {
      const pos = headers.indexOf(col);
      if (pos === -1) {
        errors.push({
          file: 'results.csv',
          row: 1,
          message: `Missing required column "${col}".`,
        });
      } else {
        idx[col] = pos;
      }
    }

    const caIdx = headers.indexOf('ca_score');
    const examIdx = headers.indexOf('exam_score');
    const totalIdx = headers.indexOf('total_score');
    const levelIdx = headers.indexOf('level');

    const hasCaExam = caIdx >= 0 && examIdx >= 0;
    const hasTotal = totalIdx >= 0;

    if (!hasCaExam && !hasTotal) {
      errors.push({
        file: 'results.csv',
        row: 1,
        message: 'results.csv must have either (ca_score and exam_score) or total_score.',
      });
    }

    if (resultRows.length - 1 > MAX_RESULT_ROWS) {
      errors.push({
        file: 'results.csv',
        row: MAX_RESULT_ROWS + 2,
        message: `Too many result rows (${resultRows.length - 1}). Maximum supported is ${MAX_RESULT_ROWS.toLocaleString()}.`,
      });
    }

    const seenKeys = new Set<string>();
    const studentsWithResults = new Set<string>();

    if (Object.keys(idx).length === reqCols.length && (hasCaExam || hasTotal)) {
      for (let r = 1; r < resultRows.length; r++) {
        const cols = resultRows[r];
        const rowNum = r + 1;
        const matricNumber = (cols[idx.matric_number] || '').trim();
        const norm = normalizeMatric(matricNumber);
        const session = (cols[idx.session] || '').trim();
        const rawSem = (cols[idx.semester] || '').trim();
        const semester = normalizeSemester(rawSem);
        const courseCode = (cols[idx.course_code] || '').trim().toUpperCase();
        const courseTitle = (cols[idx.course_title] || '').trim();
        const rawUnits = (cols[idx.units] || '').trim();
        const units = Number(rawUnits);
        const level = levelIdx >= 0 ? (cols[levelIdx] || '').trim() : '';

        if (!norm) {
          errors.push({ file: 'results.csv', row: rowNum, message: 'Blank matric_number.' });
          continue;
        }
        if (studentMap.size > 0 && !studentMap.has(norm)) {
          errors.push({
            file: 'results.csv',
            row: rowNum,
            message: `Unknown matric_number "${matricNumber}" not found in students.csv.`,
          });
          continue;
        }
        if (!session) {
          errors.push({ file: 'results.csv', row: rowNum, message: `Blank session for ${matricNumber}.` });
          continue;
        }
        if (!semester) {
          errors.push({
            file: 'results.csv',
            row: rowNum,
            message: `Unknown semester "${rawSem}" for ${matricNumber}. Use First or Second.`,
          });
          continue;
        }
        if (!courseCode) {
          errors.push({ file: 'results.csv', row: rowNum, message: `Blank course_code for ${matricNumber}.` });
          continue;
        }
        if (!Number.isInteger(units) || units < 1 || units > 8) {
          errors.push({
            file: 'results.csv',
            row: rowNum,
            message: `Invalid units "${rawUnits}" for ${courseCode}. Must be a whole number from 1 to 8.`,
          });
          continue;
        }

        const dupKey = `${norm}|${session}|${semester}|${courseCode.replace(/\s+/g, '')}`;
        if (seenKeys.has(dupKey)) {
          errors.push({
            file: 'results.csv',
            row: rowNum,
            message: `Duplicate course "${courseCode}" for ${matricNumber} in ${session} ${semester} Semester.`,
          });
          continue;
        }
        seenKeys.add(dupKey);

        let caScore: number | null = null;
        let examScore: number | null = null;
        let totalScore = 0;

        const rawCa = hasCaExam ? (cols[caIdx] || '').trim() : '';
        const rawExam = hasCaExam ? (cols[examIdx] || '').trim() : '';
        const rawTotal = hasTotal ? (cols[totalIdx] || '').trim() : '';

        if (hasCaExam && (rawCa !== '' || rawExam !== '')) {
          const caNum = Number(rawCa);
          const examNum = Number(rawExam);
          if (rawCa === '' || !Number.isFinite(caNum) || caNum < 0 || caNum > caMax) {
            errors.push({
              file: 'results.csv',
              row: rowNum,
              message: `Invalid ca_score "${rawCa}" for ${matricNumber} (${courseCode}). Allowed range: 0–${caMax}.`,
            });
            continue;
          }
          if (rawExam === '' || !Number.isFinite(examNum) || examNum < 0 || examNum > examMax) {
            errors.push({
              file: 'results.csv',
              row: rowNum,
              message: `Invalid exam_score "${rawExam}" for ${matricNumber} (${courseCode}). Allowed range: 0–${examMax}.`,
            });
            continue;
          }
          caScore = Math.round(caNum * 100) / 100;
          examScore = Math.round(examNum * 100) / 100;
          totalScore = Math.round((caScore + examScore) * 100) / 100;
        } else if (hasTotal) {
          const totNum = Number(rawTotal);
          if (rawTotal === '' || !Number.isFinite(totNum) || totNum < 0 || totNum > maxTotal) {
            errors.push({
              file: 'results.csv',
              row: rowNum,
              message: `Invalid total_score "${rawTotal}" for ${matricNumber} (${courseCode}). Allowed range: 0–${maxTotal}.`,
            });
            continue;
          }
          totalScore = Math.round(totNum * 100) / 100;
        } else {
          errors.push({
            file: 'results.csv',
            row: rowNum,
            message: `Missing scores for ${matricNumber} (${courseCode}).`,
          });
          continue;
        }

        studentsWithResults.add(norm);
        results.push({
          matricNumber,
          normalizedMatric: norm,
          session,
          semester,
          courseCode,
          courseTitle: courseTitle || courseCode,
          units,
          level,
          caScore,
          examScore,
          totalScore,
          rowNumber: rowNum,
        });
      }

      for (const st of students) {
        if (!studentsWithResults.has(st.normalizedMatric)) {
          warnings.push({
            file: 'students.csv',
            row: st.rowNumber,
            message: `${st.fullName} (${st.matricNumber}) currently has no rows in results.csv.`,
          });
        }
      }
    }
  }

  const faculties = new Set(students.map((s) => s.faculty));
  const departments = new Set(students.map((s) => s.department));
  const sessions = Array.from(new Set(results.map((r) => r.session))).sort();
  const outputMode: 'single' | 'sharded' =
    students.length > SINGLE_FILE_STUDENT_LIMIT ? 'sharded' : 'single';

  return {
    valid: errors.length === 0 && students.length > 0,
    errors,
    warnings,
    students,
    results,
    summary: {
      studentsCount: students.length,
      facultiesCount: faculties.size,
      departmentsCount: departments.size,
      sessionsCount: sessions.length,
      sessions,
      resultRowsCount: results.length,
      outputMode,
    },
  };
}

/**
 * Exact half-up rounding to 2 decimals using integer arithmetic:
 * tcpScaled = sum(units * Math.round(point * 100))
 * denominator = sum(units)
 */
export function roundHalfUp2FromScaled(tcpScaled: number, tnu: number): number {
  if (tnu <= 0) return 0;
  const cents = Math.floor((tcpScaled * 2 + tnu) / (2 * tnu));
  return cents / 100;
}

export function resolveUniversityGrade(
  totalScore: number,
  gradeBands: UniversityGradeBand[] = PRESET_5_POINT.gradeBands
): UniversityGradeBand {
  const sorted = (gradeBands && gradeBands.length ? gradeBands : PRESET_5_POINT.gradeBands)
    .slice()
    .sort((a, b) => b.min - a.min);
  const clamped = Math.max(0, Math.min(100, Number.isFinite(totalScore) ? totalScore : 0));
  for (const band of sorted) {
    if (clamped >= band.min) return band;
  }
  return sorted[sorted.length - 1];
}

export function resolveDegreeClass(
  cgpa: number,
  degreeBands: DegreeClassBand[] = PRESET_5_POINT.degreeBands
): string {
  const bands = (degreeBands && degreeBands.length ? degreeBands : PRESET_5_POINT.degreeBands)
    .slice()
    .sort((a, b) => b.min - a.min);
  const cgpaCents = Math.round((Number.isFinite(cgpa) ? cgpa : 0) * 100);
  for (const band of bands) {
    if (cgpaCents >= Math.round(band.min * 100)) {
      return band.label;
    }
  }
  return 'Below Pass';
}

export function resolveAcademicStanding(
  cgpa: number,
  rules: AcademicStandingRules = PRESET_5_POINT.standingRules
): string {
  const cgpaCents = Math.round((Number.isFinite(cgpa) ? cgpa : 0) * 100);
  const goodCents = Math.round(rules.goodStandingMin * 100);
  const senateCents = Math.round(rules.senateThreshold * 100);
  if (cgpaCents >= goodCents) return 'Good standing';
  if (cgpaCents < senateCents) return 'Referred to Senate';
  return 'Probation';
}

export interface ComputeUniversityOptions {
  caMax?: number;
  examMax?: number;
  passMark?: number;
  requiredUnits?: number;
  gradeBands?: UniversityGradeBand[];
  degreeBands?: DegreeClassBand[];
  standingRules?: AcademicStandingRules;
  repeatPolicy?: RepeatPolicy;
}

/**
 * Computes full academic records for all students using integer arithmetic,
 * chronological semester tracking, repeat policy handling, and unresolved carryover detection.
 */
export function computeUniversityDataset(
  students: RawUniversityStudent[],
  results: RawUniversityResult[],
  options: ComputeUniversityOptions = {}
): {
  sessions: string[];
  payloads: UniversityStudentPayload[];
  stats: PortalDataBundle['stats'];
} {
  const passMark = options.passMark ?? 40;
  const requiredUnits = options.requiredUnits ?? 120;
  const gradeBands = options.gradeBands || PRESET_5_POINT.gradeBands;
  const degreeBands = options.degreeBands || PRESET_5_POINT.degreeBands;
  const standingRules = options.standingRules || PRESET_5_POINT.standingRules;
  const repeatPolicy: RepeatPolicy = options.repeatPolicy || 'latest_replaces';

  // Group results by normalizedMatric -> session -> semester
  const byStudent = new Map<string, Map<string, Map<SemesterName, RawUniversityResult[]>>>();
  for (const st of students) {
    byStudent.set(st.normalizedMatric, new Map());
  }
  for (const row of results) {
    const sMap = byStudent.get(row.normalizedMatric);
    if (!sMap) continue;
    let sessMap = sMap.get(row.session);
    if (!sessMap) {
      sessMap = new Map();
      sMap.set(row.session, sessMap);
    }
    const list = sessMap.get(row.semester) || [];
    list.push(row);
    sessMap.set(row.semester, list);
  }

  const semOrder: Record<SemesterName, number> = { First: 1, Second: 2 };
  const allSessions = Array.from(new Set(results.map((r) => r.session))).sort();
  const faculties = new Set(students.map((s) => s.faculty));
  const departments = new Set(students.map((s) => s.department));

  const payloads: UniversityStudentPayload[] = students.map((st) => {
    const sMap = byStudent.get(st.normalizedMatric)!;
    const studentSessions = Array.from(sMap.keys()).sort();
    const semestersBySession: Record<string, Partial<Record<SemesterName, ComputedSemesterReport>>> = {};
    const chronologicalSemesters: UniversityStudentPayload['chronologicalSemesters'] = [];

    // Track course attempts chronologically for repeat policies & carryovers
    const latestAttemptByCourse = new Map<
      string,
      {
        courseCode: string;
        courseTitle: string;
        units: number;
        gpScaled: number;
        passed: boolean;
        session: string;
        semester: SemesterName;
        score: number;
      }
    >();
    const allAttempts: Array<{ units: number; gpScaled: number }> = [];
    const passedCourseUnits = new Map<string, number>();

    for (const session of studentSessions) {
      const sessMap = sMap.get(session)!;
      const sems = Array.from(sessMap.keys()).sort((a, b) => semOrder[a] - semOrder[b]);
      semestersBySession[session] = {};

      for (const sem of sems) {
        const rawRows = sessMap.get(sem)!;
        let tnu = 0;
        let tcpScaled = 0;
        const level = rawRows.find((r) => r.level)?.level || st.currentLevel;

        const courses: ComputedCourseRow[] = rawRows.map((r) => {
          const courseKey = r.courseCode.replace(/\s+/g, '').toUpperCase();
          const isRepeat = latestAttemptByCourse.has(courseKey);
          const gradeBand = resolveUniversityGrade(r.totalScore, gradeBands);
          const gpScaled = Math.round(gradeBand.point * 100);
          const passed = r.totalScore >= passMark && gpScaled > 0;
          const cpScaled = r.units * gpScaled;

          tnu += r.units;
          tcpScaled += cpScaled;

          latestAttemptByCourse.set(courseKey, {
            courseCode: r.courseCode,
            courseTitle: r.courseTitle,
            units: r.units,
            gpScaled,
            passed,
            session,
            semester: sem,
            score: r.totalScore,
          });
          allAttempts.push({ units: r.units, gpScaled });
          if (passed) {
            passedCourseUnits.set(courseKey, r.units);
          }

          return {
            courseCode: r.courseCode,
            courseTitle: r.courseTitle,
            units: r.units,
            ca: r.caScore,
            exam: r.examScore,
            total: r.totalScore,
            grade: gradeBand.grade,
            gradePoint: gradeBand.point,
            creditPoint: cpScaled / 100,
            isCarryover: !passed,
            isRepeat,
          };
        });

        const gpa = roundHalfUp2FromScaled(tcpScaled, tnu);

        // Compute CTNU, CTCP following repeat policy
        let ctnu = 0;
        let ctcpScaled = 0;
        if (repeatPolicy === 'latest_replaces') {
          for (const att of latestAttemptByCourse.values()) {
            ctnu += att.units;
            ctcpScaled += att.units * att.gpScaled;
          }
        } else {
          for (const att of allAttempts) {
            ctnu += att.units;
            ctcpScaled += att.units * att.gpScaled;
          }
        }

        const cgpa = roundHalfUp2FromScaled(ctcpScaled, ctnu);
        let unitsEarnedToDate = 0;
        for (const u of passedCourseUnits.values()) unitsEarnedToDate += u;

        const standing = resolveAcademicStanding(cgpa, standingRules);
        const degreeClass = resolveDegreeClass(cgpa, degreeBands);

        const report: ComputedSemesterReport = {
          session,
          semester: sem,
          level,
          courses,
          tnu,
          tcp: tcpScaled / 100,
          gpa,
          ctnu,
          ctcp: ctcpScaled / 100,
          cgpa,
          unitsEarnedToDate,
          standing,
          degreeClass,
        };

        semestersBySession[session][sem] = report;
        chronologicalSemesters.push({
          session,
          semester: sem,
          gpa,
          cgpa,
          tnu,
          tcp: tcpScaled / 100,
          level,
        });
      }
    }

    const unresolvedCarryovers: CarryoverItem[] = [];
    for (const att of latestAttemptByCourse.values()) {
      if (!att.passed) {
        unresolvedCarryovers.push({
          courseCode: att.courseCode,
          courseTitle: att.courseTitle,
          units: att.units,
          failedSession: att.session,
          failedSemester: att.semester,
          score: att.score,
        });
      }
    }

    const lastChron =
      chronologicalSemesters.length > 0
        ? chronologicalSemesters[chronologicalSemesters.length - 1]
        : null;
    const lastReport = lastChron
      ? semestersBySession[lastChron.session]?.[lastChron.semester] || null
      : null;

    return {
      matricNumber: st.matricNumber,
      normalizedMatric: st.normalizedMatric,
      fullName: st.fullName,
      faculty: st.faculty,
      department: st.department,
      programme: st.programme,
      currentLevel: st.currentLevel,
      entrySession: st.entrySession,
      gender: st.gender || undefined,
      email: st.email || undefined,
      phone: st.phone || undefined,
      sessions: studentSessions,
      semestersBySession,
      chronologicalSemesters,
      latestSummary: lastReport
        ? {
            session: lastReport.session,
            semester: lastReport.semester,
            gpa: lastReport.gpa,
            cgpa: lastReport.cgpa,
            ctnu: lastReport.ctnu,
            ctcp: lastReport.ctcp,
            unitsEarned: lastReport.unitsEarnedToDate,
            requiredUnits,
            standing: lastReport.standing,
            degreeClass: lastReport.degreeClass,
          }
        : null,
      unresolvedCarryovers,
    };
  });

  return {
    sessions: allSessions,
    payloads,
    stats: {
      students: students.length,
      faculties: faculties.size,
      departments: departments.size,
      sessions: allSessions.length,
      rows: results.length,
    },
  };
}

function getCryptoObj(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API (crypto.subtle) is unavailable in this environment.');
}

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

/**
 * Generates an unbiased 10-character access code (XXXXX-XXXXX) from
 * 23456789ABCDEFGHJKLMNPQRSTUVWXYZ using crypto.getRandomValues with rejection sampling.
 */
export function generateAccessCode(): string {
  const cryptoObj = getCryptoObj();
  const alphabet = ACCESS_CODE_ALPHABET;
  const limit = Math.floor(256 / alphabet.length) * alphabet.length; // 240
  let chars = '';
  const buf = new Uint8Array(32);
  while (chars.length < 10) {
    cryptoObj.getRandomValues(buf);
    for (let i = 0; i < buf.length && chars.length < 10; i++) {
      if (buf[i] < limit) {
        chars += alphabet[buf[i] % alphabet.length];
      }
    }
  }
  return `${chars.slice(0, 5)}-${chars.slice(5, 10)}`;
}

export function generateRandomHex(byteLength = 16): string {
  const cryptoObj = getCryptoObj();
  const bytes = new Uint8Array(byteLength);
  cryptoObj.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256Hex(input: string): Promise<string> {
  const cryptoObj = getCryptoObj();
  const digest = await cryptoObj.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function computeUniversityLookupKey(
  schoolSalt: string,
  matricNumber: string
): Promise<string> {
  return sha256Hex(`${schoolSalt}:${normalizeMatric(matricNumber)}`);
}

export async function encryptUniversityPayload(
  payload: UniversityStudentPayload,
  rawAccessCode: string
): Promise<EncryptedStudentRecord> {
  const cryptoObj = getCryptoObj();
  const normalizedCode = normalizeAccessCode(rawAccessCode);
  const salt = new Uint8Array(16);
  const iv = new Uint8Array(12);
  cryptoObj.getRandomValues(salt);
  cryptoObj.getRandomValues(iv);

  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    new TextEncoder().encode(normalizedCode),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await cryptoObj.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const ciphertext = await cryptoObj.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    new TextEncoder().encode(JSON.stringify(payload))
  );

  return {
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    data: bytesToBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptUniversityPayload(
  record: EncryptedStudentRecord,
  rawAccessCode: string
): Promise<UniversityStudentPayload> {
  const cryptoObj = getCryptoObj();
  const normalizedCode = normalizeAccessCode(rawAccessCode);
  const saltBytes = base64ToBytes(record.salt);
  const ivBytes = base64ToBytes(record.iv);
  const cipherBytes = base64ToBytes(record.data);

  const saltBuf = saltBytes.buffer.slice(saltBytes.byteOffset, saltBytes.byteOffset + saltBytes.byteLength) as ArrayBuffer;
  const ivBuf = ivBytes.buffer.slice(ivBytes.byteOffset, ivBytes.byteOffset + ivBytes.byteLength) as ArrayBuffer;
  const cipherBuf = cipherBytes.buffer.slice(cipherBytes.byteOffset, cipherBytes.byteOffset + cipherBytes.byteLength) as ArrayBuffer;

  const keyMaterial = await cryptoObj.subtle.importKey(
    'raw',
    new TextEncoder().encode(normalizedCode),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const aesKey = await cryptoObj.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBuf, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const plainBuffer = await cryptoObj.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuf },
    aesKey,
    cipherBuf
  );

  return JSON.parse(new TextDecoder().decode(plainBuffer)) as UniversityStudentPayload;
}

const WORKER_SCRIPT = `
self.onmessage = async function(ev) {
  var item = ev.data;
  try {
    var enc = new TextEncoder();
    var salt = new Uint8Array(16);
    var iv = new Uint8Array(12);
    self.crypto.getRandomValues(salt);
    self.crypto.getRandomValues(iv);

    var hashBuf = await self.crypto.subtle.digest('SHA-256', enc.encode(item.schoolSalt + ':' + item.normalizedMatric));
    var lookupKey = Array.from(new Uint8Array(hashBuf)).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');

    var keyMat = await self.crypto.subtle.importKey('raw', enc.encode(item.normalizedCode), { name: 'PBKDF2' }, false, ['deriveKey']);
    var aesKey = await self.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: item.iterations, hash: 'SHA-256' },
      keyMat,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    var cipherBuf = await self.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, aesKey, enc.encode(item.jsonStr));

    function toB64(u8) {
      var s = '';
      for (var i = 0; i < u8.length; i += 0x8000) {
        s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
      }
      return btoa(s);
    }

    self.postMessage({
      ok: true,
      index: item.index,
      lookupKey: lookupKey,
      record: { salt: toB64(salt), iv: toB64(iv), data: toB64(new Uint8Array(cipherBuf)) }
    });
  } catch (err) {
    self.postMessage({ ok: false, index: item.index, error: err && err.message ? err.message : String(err) });
  }
};
`;

/**
 * Encrypts all students into single-file (<=800) or sharded (801..10,000) output.
 * In browser environments, uses a pool of up to 8 Web Workers with progress, ETA, and cancellation.
 */
export async function buildEncryptedUniversityPortalData(
  dataset: ReturnType<typeof computeUniversityDataset>,
  options: {
    existingCodes?: Record<string, string>;
    schoolSalt?: string;
    isDemo?: boolean;
    useWorkers?: boolean;
    signal?: AbortSignal;
    onProgress?: (completed: number, total: number, etaSeconds: number) => void;
  } = {}
): Promise<{
  portalData: PortalDataBundle;
  accessRecords: UniversityAccessRecord[];
}> {
  const schoolSalt = options.schoolSalt || generateRandomHex(16);
  const payloads = dataset.payloads;
  const total = payloads.length;
  const startMs = Date.now();

  const accessRecords: UniversityAccessRecord[] = payloads.map((p) => {
    const code = options.existingCodes?.[p.normalizedMatric] || generateAccessCode();
    return {
      matricNumber: p.matricNumber,
      normalizedMatric: p.normalizedMatric,
      fullName: p.fullName,
      faculty: p.faculty,
      department: p.department,
      programme: p.programme,
      currentLevel: p.currentLevel,
      accessCode: code,
    };
  });

  const encryptedPairs: Array<{ lookupKey: string; record: EncryptedStudentRecord }> = new Array(total);
  const canUseWorkers =
    options.useWorkers !== false &&
    typeof Worker !== 'undefined' &&
    typeof Blob !== 'undefined' &&
    typeof URL !== 'undefined';

  if (canUseWorkers && total > 0) {
    const hw = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency : 4;
    const poolSize = Math.min(8, Math.max(1, hw), total);
    const workerUrl = URL.createObjectURL(new Blob([WORKER_SCRIPT], { type: 'application/javascript' }));

    await new Promise<void>((resolve, reject) => {
      let nextIdx = 0;
      let completed = 0;
      let settled = false;
      const workers: Worker[] = [];

      function cleanup() {
        workers.forEach((w) => {
          try { w.terminate(); } catch { /* ignore */ }
        });
        URL.revokeObjectURL(workerUrl);
      }

      if (options.signal) {
        if (options.signal.aborted) {
          cleanup();
          reject(new Error('Build cancelled by user.'));
          return;
        }
        options.signal.addEventListener(
          'abort',
          () => {
            if (settled) return;
            settled = true;
            cleanup();
            reject(new Error('Build cancelled by user.'));
          },
          { once: true }
        );
      }

      function dispatch(w: Worker) {
        if (settled || nextIdx >= total) return;
        const i = nextIdx++;
        const p = payloads[i];
        w.postMessage({
          index: i,
          schoolSalt,
          normalizedMatric: p.normalizedMatric,
          normalizedCode: normalizeAccessCode(accessRecords[i].accessCode),
          iterations: PBKDF2_ITERATIONS,
          jsonStr: JSON.stringify(p),
        });
      }

      for (let wIdx = 0; wIdx < poolSize; wIdx++) {
        const w = new Worker(workerUrl);
        workers.push(w);
        w.onmessage = (ev) => {
          if (settled) return;
          const msg = ev.data;
          if (!msg.ok) {
            settled = true;
            cleanup();
            reject(new Error(msg.error || 'Worker encryption failed.'));
            return;
          }
          encryptedPairs[msg.index] = { lookupKey: msg.lookupKey, record: msg.record };
          completed++;
          if (options.onProgress) {
            const elapsedSec = (Date.now() - startMs) / 1000;
            const rate = completed > 0 ? elapsedSec / completed : 0;
            const eta = Math.max(0, Math.round(rate * (total - completed)));
            options.onProgress(completed, total, eta);
          }
          if (completed === total) {
            settled = true;
            cleanup();
            resolve();
          } else {
            dispatch(w);
          }
        };
        w.onerror = (err) => {
          if (settled) return;
          settled = true;
          cleanup();
          reject(new Error(err.message || 'Web Worker error'));
        };
        dispatch(w);
      }
    });
  } else {
    for (let i = 0; i < total; i++) {
      if (options.signal?.aborted) {
        throw new Error('Build cancelled by user.');
      }
      const p = payloads[i];
      const lookupKey = await computeUniversityLookupKey(schoolSalt, p.normalizedMatric);
      const record = await encryptUniversityPayload(p, accessRecords[i].accessCode);
      encryptedPairs[i] = { lookupKey, record };
      if (options.onProgress) {
        const elapsedSec = (Date.now() - startMs) / 1000;
        const rate = (Date.now() - startMs) / 1000 / (i + 1);
        const eta = Math.max(0, Math.round(rate * (total - (i + 1))));
        void elapsedSec;
        options.onProgress(i + 1, total, eta);
      }
    }
  }

  const isSharded = total > SINGLE_FILE_STUDENT_LIMIT;
  const studentsMap: Record<string, EncryptedStudentRecord> = {};
  const shards: Record<string, Record<string, EncryptedStudentRecord>> = {};

  for (const pair of encryptedPairs) {
    if (isSharded) {
      const prefix = pair.lookupKey.slice(0, 2);
      if (!shards[prefix]) shards[prefix] = {};
      shards[prefix][pair.lookupKey] = pair.record;
    } else {
      studentsMap[pair.lookupKey] = pair.record;
    }
  }

  return {
    portalData: {
      mode: isSharded ? 'sharded' : 'single',
      schoolSalt,
      sessions: dataset.sessions,
      students: studentsMap,
      shards: isSharded ? shards : undefined,
      stats: dataset.stats,
      generatedAt: new Date().toISOString(),
      isDemo: Boolean(options.isDemo),
    },
    accessRecords,
  };
}

/**
 * Target degree class GPA calculator (client-side estimate).
 */
export function calculateTargetGpaNeeded(params: {
  unitsEarned: number;
  ctcp: number;
  ctnu: number;
  requiredUnits: number;
  targetMinCgpa: number;
  maxGradePoint: number;
}): {
  remainingUnits: number;
  neededGpa: number;
  possible: boolean;
  alreadyAchieved: boolean;
  message: string;
} {
  const remainingUnits = Math.max(0, params.requiredUnits - params.unitsEarned);
  const currentCgpa = params.ctnu > 0 ? params.ctcp / params.ctnu : 0;

  if (remainingUnits === 0) {
    const ok = currentCgpa >= params.targetMinCgpa;
    return {
      remainingUnits: 0,
      neededGpa: 0,
      possible: ok,
      alreadyAchieved: ok,
      message: ok
        ? 'You have completed the required units and met this target CGPA.'
        : 'All required units are complete and this target is no longer mathematically possible.',
    };
  }

  const totalUnitsAtGrad = params.ctnu + remainingUnits;
  const targetTotalPoints = params.targetMinCgpa * totalUnitsAtGrad;
  const pointsNeeded = targetTotalPoints - params.ctcp;
  const neededGpa = Math.round((pointsNeeded / remainingUnits) * 100) / 100;

  if (neededGpa <= 0) {
    return {
      remainingUnits,
      neededGpa: 0,
      possible: true,
      alreadyAchieved: true,
      message: `Estimate: Your current credit points already exceed the pace needed across the remaining ${remainingUnits} units.`,
    };
  }

  if (neededGpa > params.maxGradePoint) {
    return {
      remainingUnits,
      neededGpa,
      possible: false,
      alreadyAchieved: false,
      message: `Not mathematically possible: reaching ${params.targetMinCgpa.toFixed(2)} would require an average GPA of ${neededGpa.toFixed(2)} over ${remainingUnits} remaining units, above the ${params.maxGradePoint.toFixed(2)} maximum.`,
    };
  }

  return {
    remainingUnits,
    neededGpa,
    possible: true,
    alreadyAchieved: false,
    message: `Estimate: You need an average GPA of ${neededGpa.toFixed(2)} across your remaining ${remainingUnits} units.`,
  };
}

export function buildUniversityAccessSlipsHtml(
  config: Partial<TemplateConfig>,
  accessRecords: UniversityAccessRecord[]
): string {
  const instName = config.businessName || 'Greenfield State University';
  const portalUrl =
    (config.institutionWebsite || 'https://portal.greenfieldstate.edu.ng').replace(/\/$/, '') +
    '/#/portal';
  const logoUrl = validateImageUrl(config.logoUrl);
  const primary = config.primaryColor || '#1B3A6B';
  const initials = getInitials(instName);

  const pages: UniversityAccessRecord[][] = [];
  for (let i = 0; i < accessRecords.length; i += 8) {
    pages.push(accessRecords.slice(i, i + 8));
  }

  const pagesHtml = pages
    .map(
      (pageRecords) => `
    <section class="a4-sheet">
      ${pageRecords
        .map(
          (rec) => `
        <article class="slip-card">
          <header class="slip-header">
            ${
              logoUrl
                ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(instName)}" class="slip-logo" />`
                : `<span class="slip-monogram">${escapeHtml(initials)}</span>`
            }
            <div>
              <div class="slip-school">${escapeHtml(instName)}</div>
              <div class="slip-subtitle">Student Portal Access Slip</div>
            </div>
          </header>
          <div class="slip-body">
            <div class="slip-row"><span class="slip-label">Student:</span> <strong>${escapeHtml(rec.fullName)}</strong></div>
            <div class="slip-row"><span class="slip-label">Department:</span> <span>${escapeHtml(rec.department)}</span></div>
            <div class="slip-row"><span class="slip-label">Matric No:</span> <code class="slip-code">${escapeHtml(rec.matricNumber)}</code></div>
            <div class="slip-code-box">
              <span class="slip-code-label">Access Code</span>
              <strong class="slip-secret">${escapeHtml(rec.accessCode)}</strong>
            </div>
            <div class="slip-url">Portal: ${escapeHtml(portalUrl)}</div>
          </div>
          <footer class="slip-footer">
            Confidential: give this slip only to the student.
          </footer>
        </article>
      `
        )
        .join('')}
    </section>
  `
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Access Slips — ${escapeHtml(instName)}</title>
  <style>
    :root { --brand: ${escapeHtml(primary)}; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F1F5F9; color: #0F172A; padding: 16px; }
    .print-toolbar { max-width: 210mm; margin: 0 auto 16px; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 10px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
    .print-toolbar h1 { font-size: 1rem; color: var(--brand); }
    .print-toolbar p { font-size: 0.84rem; color: #475569; }
    .print-btn { background: var(--brand); color: #FFFFFF; border: none; border-radius: 8px; padding: 10px 18px; font-weight: 700; cursor: pointer; font-size: 0.9rem; }
    .a4-sheet { width: 210mm; min-height: 297mm; margin: 0 auto 20px; background: #FFFFFF; padding: 8mm; display: grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(4, 1fr); gap: 6mm; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08); page-break-after: always; }
    .a4-sheet:last-child { page-break-after: auto; }
    .slip-card { border: 1.5px dashed #94A3B8; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: space-between; page-break-inside: avoid; background: #FFFFFF; }
    .slip-header { display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; margin-bottom: 6px; }
    .slip-logo { width: 28px; height: 28px; border-radius: 6px; object-fit: cover; }
    .slip-monogram { width: 28px; height: 28px; border-radius: 6px; background: var(--brand); color: #FFFFFF; font-weight: 800; font-size: 0.78rem; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .slip-school { font-weight: 800; font-size: 0.82rem; color: var(--brand); line-height: 1.2; }
    .slip-subtitle { font-size: 0.66rem; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .slip-body { font-size: 0.76rem; display: grid; gap: 3px; }
    .slip-row { display: flex; justify-content: space-between; gap: 8px; }
    .slip-label { color: #64748B; }
    .slip-code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-weight: 700; }
    .slip-code-box { background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 5px 8px; display: flex; justify-content: space-between; align-items: center; margin: 2px 0; }
    .slip-code-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; font-weight: 700; }
    .slip-secret { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.94rem; letter-spacing: 0.08em; color: #0F172A; }
    .slip-url { font-size: 0.66rem; color: #475569; word-break: break-all; }
    .slip-footer { border-top: 1px solid #E2E8F0; padding-top: 5px; margin-top: 4px; font-size: 0.65rem; color: #B45309; font-weight: 600; }
    @page { size: A4; margin: 6mm; }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .print-toolbar { display: none !important; }
      .a4-sheet { box-shadow: none; margin: 0; width: 100%; min-height: auto; padding: 2mm; }
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <div>
      <h1>${escapeHtml(instName)} — Student Access Slips (${accessRecords.length} students)</h1>
      <p>8 slips per A4 sheet. Print, cut along the dashed lines, and give each slip only to the student.</p>
    </div>
    <button class="print-btn" onclick="window.print()">Print A4 Slips</button>
  </div>
  ${pagesHtml}
</body>
</html>`;
}

function csvCell(v: string): string {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildUniversityCodesCsv(accessRecords: UniversityAccessRecord[]): string {
  const lines = ['matric_number,full_name,faculty,department,level,access_code'];
  for (const r of accessRecords) {
    lines.push(
      [
        csvCell(r.matricNumber),
        csvCell(r.fullName),
        csvCell(r.faculty),
        csvCell(r.department),
        csvCell(r.currentLevel),
        csvCell(r.accessCode),
      ].join(',')
    );
  }
  return lines.join('\n');
}

export function buildRobotsTxt(): string {
  return 'User-agent: *\nDisallow: /data/\n';
}

export function buildUniversityReadme(
  config: Partial<TemplateConfig>,
  mode: 'single' | 'sharded'
): string {
  const instName = config.businessName || 'Greenfield State University';
  const helpEmail = config.helpdesk?.email || config.email || 'ict@example.com';
  const helpPhone = config.helpdesk?.phone || config.phone || '0800 000 0000';

  return `======================================================================
${instName.toUpperCase()} — VARSITY UNIVERSITY PORTAL PACKAGE
======================================================================

OUTPUT MODE: ${mode === 'sharded' ? 'SHARDED (data/{xx}.json — 801 to 10,000 students)' : 'SINGLE FILE (embedded inside index.html — up to 800 students)'}

FILES IN THIS PACKAGE
---------------------
1. index.html          -> Complete university website + encrypted student portal.
2. ${mode === 'sharded' ? 'data/{xx}.json      -> Sharded encrypted student blobs (upload WITH index.html).' : '(Single-file mode embeds all encrypted blobs in index.html.)'}
3. robots.txt          -> Tells search engines not to index the /data/ folder.
4. access-slips.html   -> Printable A4 access slips (8 per sheet). DO NOT UPLOAD.
5. codes.csv           -> Master list of matric numbers & access codes. KEEP OFFLINE.
6. students.csv        -> Sample/source student list CSV.
7. results.csv         -> Sample/source course results CSV.
8. README.txt          -> This setup, operations, and data protection guide.

STEP 1: UPLOADING TO A WEB HOST (HTTPS REQUIRED)
------------------------------------------------
Upload ONLY index.html, robots.txt${mode === 'sharded' ? ', and the data/ folder' : ''} to your web host:
- cPanel / Shared Hosting: Upload to public_html/ (or a subfolder like public_html/portal/).
- Netlify Drop / Cloudflare Pages / GitHub Pages: Deploy the public folder over HTTPS.

IMPORTANT HOSTING NOTES:
- Do NOT upload codes.csv or access-slips.html to any web server! Keep them
  offline on a password-protected Registry / ICT workstation.
- ${mode === 'sharded' ? 'Sharded mode uses fetch("data/{xx}.json"), so the portal MUST be opened over http:// or https:// (not double-clicked as file://).' : 'Single-file mode works even when hosted as one file, and requires HTTPS for Web Crypto decryption.'}
- Browsers require HTTPS (or localhost) for Web Crypto decryption (crypto.subtle).

STEP 2: DISTRIBUTING ACCESS SLIPS
---------------------------------
1. Open access-slips.html in Chrome or Edge on the Registry computer.
2. Click "Print A4 Slips" (8 slips print per A4 sheet).
3. Cut along the dashed lines and issue each slip confidentially ONLY to the
   verified student (check Student ID card before handing over a slip).

STEP 3: PUBLISHING NEXT SEMESTER'S RESULTS
------------------------------------------
1. Append the new semester's rows to results.csv (e.g. 2025/2026 Second Semester).
2. Open the Frontdoor Varsity Builder (customizer.html?template=universityportal).
3. Upload your updated students.csv and results.csv.
4. Choose whether to keep existing student codes or click "Reissue codes".
5. Click "Generate portal", download the new ZIP, and replace index.html${mode === 'sharded' ? ' and data/' : ''} on your host.

STEP 4: LOST ACCESS CODES
-------------------------
Students tap "Lost your code?" to send a pre-filled WhatsApp (${helpPhone})
or email (${helpEmail}) request to the ICT Helpdesk with their name, matric
number, and department. After verifying the student's identity offline against
codes.csv, the Registry/ICT officer shares their code or issues fresh slips in
the next build.

HONEST SYSTEM LIMITS (STATIC PORTAL ARCHITECTURE)
-------------------------------------------------
Because this portal runs 100% as static encrypted files without a backend server:
- Zero server crashes on result-release day when thousands check at once.
- Results are published as encrypted static files; updating scores requires
  rebuilding in the customizer and re-uploading to your host.
- There is no lecturer online score-entry portal.
- There is no online course registration module.
- There is no automated self-service password reset email/SMS link (true
  self-service reset requires a live server and database; ask the developer
  if your institution needs a full backend version).

DATA PROTECTION & PRIVACY NOTICE (NDPA 2023)
--------------------------------------------
Institutions handle students' personal academic data and must comply with
applicable data protection laws such as the Nigeria Data Protection Act (NDPA 2023).
- Each student's record is individually encrypted with PBKDF2-SHA-256 (120,000
  iterations) + AES-GCM-256; published files contain zero plaintext student names,
  matric numbers, phone numbers, or grades.
- Keep access-slips.html and codes.csv strictly private and publish portals only
  with official institutional authorization.
======================================================================
`;
}
