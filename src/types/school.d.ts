interface InviteInput {
    schoolId: string,
    emails: string[]
}

interface DeleteInviteInput {
    schoolId: string,
    inviteId: string
}

interface DeleteStaffInput {
    schoolId: string,
    staffId: string
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

interface EditSchoolInput {
    schoolId: string,
    name: string?,
    address: string?
}