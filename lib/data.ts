export interface Currency {
    code: string;
    name: string;
    locale:string
}

export const currencies: Currency[] = [
    { code: "USD", name: "United States Dollar", locale: "en-US" },
    { code: "EUR", name: "Euro", locale: "de-DE" },
    { code: "JPY", name: "Japanese Yen", locale: "ja-JP" },
    { code: "GBP", name: "British Pound Sterling", locale: "en-GB" },
    { code: "AUD", name: "Australian Dollar", locale: "en-AU" },
    { code: "CAD", name: "Canadian Dollar", locale: "en-CA" },
    { code: "CHF", name: "Swiss Franc", locale: "de-CH" },
    { code: "CNY", name: "Chinese Yuan", locale: "zh-CN" },
    { code: "SEK", name: "Swedish Krona", locale: "sv-SE" },
    { code: "NZD", name: "New Zealand Dollar", locale: "en-NZ" },
    { code: "MXN", name: "Mexican Peso", locale: "es-MX" },
    { code: "SGD", name: "Singapore Dollar", locale: "en-SG" },
    { code: "HKD", name: "Hong Kong Dollar", locale: "zh-HK" },
    { code: "NOK", name: "Norwegian Krone", locale: "nb-NO" },
    { code: "KRW", name: "South Korean Won", locale: "ko-KR" },
    { code: "TRY", name: "Turkish Lira", locale: "tr-TR" },
    { code: "INR", name: "Indian Rupee", locale: "hi-IN" },
    { code: "RUB", name: "Russian Ruble", locale: "ru-RU" },
    { code: "BRL", name: "Brazilian Real", locale: "pt-BR" },
    { code: "ZAR", name: "South African Rand", locale: "en-ZA" },
];
export type Category = {
    type: "income" | "expense";
    name: string;
};

export const incomeCategories: Category[] = [
    
    { type: "income", name: "Salary/Wages" },
    { type: "income", name: "Selling" },
    { type: "income", name: "Commissions" },
    { type: "income", name: "Investment Returns" },
    { type: "income", name: "Rent" },
    { type: "income", name: "Dividends" },
    { type: "income", name: "Interest" },
    { type: "income", name: "Profit" },
    { type: "income", name: "Royalties" },
    { type: "income", name: "Capital Gains" },
    { type: "income", name: "Gifts" },
    { type: "income", name: "Awards" },
    { type: "income", name: "Grants" }
  ];


export const expenseCategories: Category[] = [
    { type: "expense", name: "Grocery" },
    { type: "expense", name: "Rent" },
    { type: "expense", name: "Utilities" },
    { type: "expense", name: "Transportation" },
    { type: "expense", name: "Insurance" },
    { type: "expense", name: "Healthcare" },
    { type: "expense", name: "Dining Out" },
    { type: "expense", name: "Entertainment" },
    { type: "expense", name: "Travel" },
    { type: "expense", name: "Clothing" },
    { type: "expense", name: "Education" },
    { type: "expense", name: "Subscriptions" },
    { type: "expense", name: "Loan Repayment" },
    { type: "expense", name: "Savings" },
    { type: "expense", name: "Household Supplies" },
    { type: "expense", name: "Childcare" },
    { type: "expense", name: "Gifts" },
    { type: "expense", name: "Charity" },
    { type: "expense", name: "Pet Care" },
    { type: "expense", name: "Personal Care" },
    { type: "expense", name: "Taxes" },
    { type: "expense", name: "Maintenance" },
    { type: "expense", name: "Miscellaneous" },
    { type: "expense", name: "Home Improvement" },
    { type: "expense", name: "Furniture" },
    { type: "expense", name: "Appliances" },
    { type: "expense", name: "Electronics" },
    { type: "expense", name: "Software Subscriptions" },
    { type: "expense", name: "Streaming Services" },
    { type: "expense", name: "Gym Membership" },
    { type: "expense", name: "Hobbies" },
    { type: "expense", name: "Home Security" },
    { type: "expense", name: "Landscaping" },
    { type: "expense", name: "Pest Control" },
    { type: "expense", name: "Property Taxes" },
];