export interface CourseFacultyLevel {
    id?: number;
    courseId: number;
    facultyId: number;
    level: number;
}

// Extended interface with related data for display purposes
export interface CourseFacultyLevelWithDetails extends CourseFacultyLevel {
    courseName?: string;
    facultyName?: string;
} 