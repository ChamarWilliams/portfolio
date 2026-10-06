"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const COVER_MS = 360;
const REVEAL_MS = 400;
const EASE = "cubic-bezier(.65,0,.25,1)";
const SCALE_0 = "translate(-50%, -50%) scale(0)";
const SCALE_1 = "translate(-50%, -50%) scale(1)";
const STATIC_FILE = /\.(pdf|html|png|jpe?g|svg|webp|zip|ico|txt|xml)$/i;

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const veil = useRef<HTMLDivElement>(null);
    const waiting = useRef(false);
    const busy = useRef(false);
    const coverDone = useRef(false);
    const routeDone = useRef(false);

    const reveal = () => {
        const el = veil.current;
        if (!el) return;
        el.animate([{ transform: SCALE_1 }, { transform: SCALE_0 }], { duration: REVEAL_MS, easing: EASE, fill: "forwards" })
            .finished.then(() => {
                el.style.display = "none";
                document.documentElement.classList.remove("e-nav");
                busy.current = false;
            });
    };

    const maybeReveal = () => {
        if (coverDone.current && routeDone.current) requestAnimationFrame(reveal);
    };

    useEffect(() => {
        if (!waiting.current) return;
        waiting.current = false;
        if (window.location.hash) {
            document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: "auto" });
        } else {
            window.scrollTo({ top: 0, behavior: "auto" });
        }
        routeDone.current = true;
        maybeReveal();
    }, [pathname]);

    useEffect(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const onClick = (e: MouseEvent) => {
            if (reduce || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = (e.target as Element).closest("a");
            if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
            const url = new URL(a.href, window.location.href);
            if (url.origin !== window.location.origin || STATIC_FILE.test(url.pathname)) return;
            if (url.pathname.replace(/\/$/, "") === window.location.pathname.replace(/\/$/, "")) return;

            e.preventDefault();
            const el = veil.current;
            if (busy.current || !el) return;
            busy.current = true;
            coverDone.current = false;
            routeDone.current = false;

            const x = e.clientX, y = e.clientY;
            const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
            el.style.cssText = `display:block;left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2}px`;
            document.documentElement.classList.add("e-nav");

            el.animate([{ transform: SCALE_0 }, { transform: SCALE_1 }], { duration: COVER_MS, easing: EASE, fill: "forwards" })
                .finished.then(() => { coverDone.current = true; maybeReveal(); });

            waiting.current = true;
            router.push(url.pathname + url.hash);
            window.setTimeout(() => {
                if (waiting.current) { waiting.current = false; routeDone.current = true; maybeReveal(); }
            }, 3000);
        };

        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, [router]);

    return (
        <>
            <div ref={veil} className="e-veil" aria-hidden="true" />
            <div key={pathname} className="e-page">{children}</div>
        </>
    );
};
