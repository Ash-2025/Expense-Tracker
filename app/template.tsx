'use client';
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
function template({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    return (

        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default template
// initial={{ opacity: 0 }}
// animate={{ opacity: 1 }}
// exit={{ opacity: 0 }}
// transition={{ duration: 0.2, ease: 'circIn' }} // Adjust duration to your liking
// bg-gradient-to-br from-black via-[#0c0b28] to-black

// background: rgb(1, 1, 7);
// background: linear - gradient(37deg, rgba(1, 1, 7, 1) 19 %, rgba(2, 2, 67, 1) 41 %, rgba(2, 2, 73, 1) 56 %, rgba(2, 6, 23, 1) 84 %);

// gradient.dev gradient
// background - size: 100 % 110 %;
// background - position: 0px 0px;
// background - image: linear - gradient(204deg, #040310FF 5 %, #10055AFF 47 %, #0C0656FF 62 %, #030C0FFF 100 %);