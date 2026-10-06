type NodeSpec = [number, number, string?, string?, number?];

type ArtSpec = {
    n: NodeSpec[];
    e: [number, number][];
    dots?: [number, number][];
    labels?: [number, number, string][];
};

const ART: Record<string, ArtSpec> = {
    trefelle: {
        n: [
            [42, 75, 'profile'], [118, 75, 'one call', 'k', 14],
            [208, 18, undefined, undefined, 8], [208, 39, undefined, undefined, 8], [208, 60, undefined, undefined, 8],
            [208, 81, undefined, undefined, 8], [208, 102, undefined, undefined, 8], [208, 123, undefined, undefined, 8],
            [292, 81, 'role', 'g', 12], [362, 81, 'practice'],
        ],
        e: [[0, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [5, 8], [8, 9]],
        labels: [[208, 143, 'up to six fields']],
    },
    'aspirers-workshop': {
        n: [[60, 75, 'client'], [200, 75, 'server', 'k', 17], [340, 75, 'client']],
        e: [[0, 1], [1, 2]],
        dots: [[130, 75], [270, 75]],
    },
    arboryn: {
        n: [[55, 75, 'base'], [160, 35, 'ours'], [160, 115, 'theirs'], [300, 75, 'merged', 'g', 14]],
        e: [[0, 1], [0, 2], [1, 3], [2, 3]],
    },
    'vlm-image-pair-judge': {
        n: [[60, 35, 'image A'], [60, 115, 'image B'], [200, 75, 'rubric', 'k', 15], [340, 75, 'verdict', 'g', 13]],
        e: [[0, 2], [1, 2], [2, 3]],
    },
};

export const Art = ({ kind }: { kind: string }) => {
    const spec = ART[kind];
    if (!spec) return null;

    return (
        <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {spec.e.map(([i, j], idx) => (
                <line key={`e${idx}`} x1={spec.n[i][0]} y1={spec.n[i][1]} x2={spec.n[j][0]} y2={spec.n[j][1]} />
            ))}
            {(spec.dots || []).map(([x, y], idx) => (
                <circle key={`d${idx}`} className="d" cx={x} cy={y} r={3.5} />
            ))}
            {(spec.labels || []).map(([x, y, text], idx) => (
                <text key={`l${idx}`} x={x} y={y}>{text}</text>
            ))}
            {spec.n.map(([x, y, label, kind2, r], idx) => {
                const radius = r || 11;
                return (
                    <g key={`n${idx}`}>
                        <circle className={`n ${kind2 || ''}`} cx={x} cy={y} r={radius} />
                        {!kind2 && <circle className="d" cx={x} cy={y} r={Math.max(2.2, radius * 0.32)} />}
                        {kind2 === 'k' && <circle className="d" cx={x} cy={y} r={4} />}
                        {label && <text x={x} y={y + radius + 15}>{label}</text>}
                    </g>
                );
            })}
        </svg>
    );
};
