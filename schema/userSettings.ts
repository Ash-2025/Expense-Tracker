import { currencies } from '@/lib/data'
import { z } from 'zod'

export const updateUserCurrencySchema = z.object({
    currency: z.custom((code: string) => {
        const found = currencies.some(c => c.code === code)
        if (!found) throw new Error(`${code} is not a valid currency`)

        return code;
    })
})