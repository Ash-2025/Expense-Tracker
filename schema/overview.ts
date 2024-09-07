import { z } from "zod";
import {differenceInDays} from 'date-fns'
export const OverviewQuerySchema = z.object({
    start:z.coerce.date(),
    end:z.coerce.date(),
}).refine((args)=>{
    const {start,end} = args;
    const days = differenceInDays(end,start)
    
    return days>=0 && days<180
})