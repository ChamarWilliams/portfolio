import Link from "next/link";

export default function NotFound() {
    return (
        <main className="e-case" style={{ textAlign: "center", paddingTop: 140 }}>
            <div className="e-eyebrow">Error 404</div>
            <h1 className="e-case-title">Page not found</h1>
            <p className="e-lede" style={{ margin: "0 auto 28px" }}>The page you are looking for does not exist.</p>
            <div className="e-btns" style={{ justifyContent: "center" }}>
                <Link className="e-btn e-fill" href="/">Back home</Link>
            </div>
        </main>
    );
}
