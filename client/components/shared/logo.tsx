import Link from "next/link";

import React from "react";
export default function Logo () {
    return (
        <h1 className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent text-lg lg:text-xl first-letter:text-3xl tracking-[2px] italic font-serif">
            <Link href="/">KlausCode</Link>
        </h1>
    )
}
