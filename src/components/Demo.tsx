"use client";

import { useEffect, useRef, useState } from "react";

interface DemoProps {
    src: string;
    title: string;
    height?: number;
}

export const Demo: React.FC<DemoProps> = ({ src, title, height = 460 }) => {
    const ref = useRef<HTMLIFrameElement>(null);
    const [h, setH] = useState(height);

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.source !== ref.current?.contentWindow) return;
            if (e.data && e.data.type === "demo-height" && typeof e.data.height === "number") {
                setH(Math.max(200, e.data.height + 4));
            }
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    return (
        <div className="e-demo">
            <iframe
                ref={ref}
                src={src}
                title={title}
                loading="lazy"
                style={{ width: "100%", height: h, border: 0, display: "block", background: "transparent" }}
            />
        </div>
    );
};
