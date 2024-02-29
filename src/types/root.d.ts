interface AddAccountInput {
    bank: string,
    accountName: string,
    accountNumber: string
}

interface SetPriceInput {
    price: number,
}

interface EditAccountInput {
    accountId: string,
    bank: string?,
    accountName: string?,
    accountNumber: string?
}