export function stripCommas(amount: string) {
    return amount.replace(/,/g, "");
}

export function formatDate(date:string) {
    return  new Date(date.slice(0,10).replace(/\//g, "-"))
}