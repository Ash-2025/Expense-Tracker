import Link from 'next/link'
import React from 'react'
import {IndianRupeeIcon} from 'lucide-react'
import {Poppins} from 'next/font/google'

const poppins = Poppins({
    subsets:['latin'],
    weight:'700'
})

function Logo() {
  return (
    <Link href="/" className='flex gap-2 items-center'>
        <IndianRupeeIcon className='stroke h-11 w-11 stroke-amber-500 stroke-[2.5]' />
        <p className={` ${poppins.className} bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent text-3xl font-bold leading-tight tracking-tighter`}>
            ExpenseTracker
        </p>
    </Link>
  )
}
export function LogoMobile(){
  return (
    <Link href="/" className='flex gap-2 items-center'>
        <p className={` ${poppins.className} bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent text-3xl font-bold leading-tight tracking-tighter`}>
            ExpenseTracker
        </p>
    </Link>
  )
}

export default Logo