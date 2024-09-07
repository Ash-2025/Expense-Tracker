import { Inter, Noto_Sans, Poppins, Roboto } from "next/font/google";

export const inter  = Inter({
    subsets:["latin"],
    weight:["100","200","500","600"]
})
export const roboto = Roboto({
    subsets:["latin"],
    weight:["100","300","500","700"]
})
export const poppins = Poppins({
    subsets:['latin'],
    weight:['100','200','300','500','700']
})
export const noto = Noto_Sans({
    subsets:['latin'],
    weight:['100','200','300','500','700']
})