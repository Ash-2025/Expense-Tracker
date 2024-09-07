'use client';
import React, { useState } from "react";
import Logo, { LogoMobile } from "./Logo";
import { usePathname } from "next/navigation";
import { motion } from 'framer-motion'
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Inter } from 'next/font/google'
import { ThemeSwitch } from "./theme-switch";
import { UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

const inter = Inter({
  subsets: ['cyrillic'],
  weight: ['600']
})

export default function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
}

const items = [
  { label: 'Dashboard', link: '/' },
  { label: 'Transactions', link: '/transactions' },
  { label: 'wizard', link: '/wizard' },
]

function NavbarItem({ link, label }: { link: string, label: string }) {
  const pathname = usePathname();
  const isActive = pathname === link
  return (
    <div className="relative flex items-center">
      <Link href={link} className={
        cn(
          inter.className,
          "w-full justify-start text-xl text-muted-foreground p-2 rounded-md hover:text-amber-500 transition-all duration-200",
          isActive && "bg-zinc-700/50"
        )
      }>
        {label}
      </Link>
    </div>
  )
}
function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b border-b-black/50 bg-background md:block">
      <nav className="container mx-auto flex gap-4 items-center justify-between px-8">
        <div className="w-full flex h-[80px] min-h-[60px] items-center gap-x-8">
          <Logo />
          <div className="flex h-full grow justify-center items-center gap-x-16">
            {items.map(item => (
              <NavbarItem key={item.label} link={item.link} label={item.label} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitch />
          <UserButton />
        </div>
      </nav>
    </div>
  )
}
function MobileNavbar() {
  const [open, isopen] = useState(false);
  return (
    <div className="block border-separate bg-background md:hidden z-10">
      <nav className="container flex justify-between items-start px-8 mt-2">
        <button onClick={() => isopen(!open)}>
          {
            open ? <X size={30} /> : <Menu size={30} />
          }
        </button>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: "spring", duration: 0.6, ease: 'easeInOut' }}
          className="overflow-hidden w-full"
        >
          {open && (
            <div className="w-fit p-4 space-x-4 rounded-lg bg-zinc-900/60">
              <LogoMobile />
              <div className="flex flex-col gap-1">
                {items.map(item => (
                  <NavbarItem key={item.label} link={item.link} label={item.label} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
        <div className="flex gap-4 items-center justify-start p-4">
          <ThemeSwitch />
          <UserButton />
        </div>
      </nav>
    </div>
  )
}