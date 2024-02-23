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