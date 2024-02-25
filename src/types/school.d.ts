interface InviteInput {
    userId: string,
    schoolId: string,
    emails: string[]
}

interface CreateClassInput {
    schoolId: string,
    name: string,
    colourCode: number?
}


interface CreateSessionInput {
    schoolId: string,
    name: string,
    students: number
}


interface AssignSessionInput {
    schoolId: string,
    sessionId: string
}

interface EditSessionInput {
    schoolId: string,
    sessionId: string,
    name: string?,
    students: number?
}

interface EditClassInput {
    schoolId: string,
    classId: string,
    name: string?,
    colourCode: number?
}