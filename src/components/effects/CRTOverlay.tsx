export const CRTOverlay = () => {
    return (
        <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
            <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(to bottom, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)',
                }}
            />

            <div className="crt-scanline absolute inset-x-0 top-0 h-1/3 animate-scanline bg-gradient-to-b from-transparent via-term-phosphor/[0.04] to-transparent" />

            <div className="crt-flicker absolute inset-0 animate-flicker bg-term-phosphor/[0.03]" />

            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
                }}
            />
        </div>
    );
};
