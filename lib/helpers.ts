import { intlFormat } from "date-fns"
import { currencies } from "./data"

export function DatetoUTCDate(date:Date){
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds(),
        )
    )
}
export function UTCDate(date:Date){
    const year = date.getFullYear()
    const month = date.getMonth()
    const d = date.getDate()

    const isoDateString = `${year}-${month+1}-${d}T21:28:50.567Z`;
    return new Date(isoDateString)
    
}
export function GetFormatterForCurrency(currencyCode:string){
    const locale = currencies.find(c => c.code === currencyCode)?.locale

    return new Intl.NumberFormat(locale , {
        style:"currency",
        currency:currencyCode
    })
}