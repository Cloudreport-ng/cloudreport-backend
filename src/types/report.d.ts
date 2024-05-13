interface UploadReportInput {
    class_id: string,
    session_id: string,
    term: 'first' | 'second' | 'third',
    data: [
        {
            name: string,
            gender: 'male' | 'female',
            age: number,
            academic_report: [
                {
                    subject: string,
                    ca_score: number,
                    exam_score: number,
                }
            ],
            other_report: [
                {
                    subject: string,
                    score: number
                }
            ],
            teacher: string,
            teacher_remark: string,
            principal: string
        }
    ]
}