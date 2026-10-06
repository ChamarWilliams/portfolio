"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const RedirectHome = ({ hash }: { hash: string }) => {
    const router = useRouter();

    useEffect(() => {
        router.replace(`/#${hash}`);
    }, [router, hash]);

    return null;
};
