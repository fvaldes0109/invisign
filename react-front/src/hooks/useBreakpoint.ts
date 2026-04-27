import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function getBreakpoint(width: number): Breakpoint {
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

export function useBreakpoint() {
    const [bp, setBp] = useState<Breakpoint>(() => getBreakpoint(window.innerWidth));

    useEffect(() => {
        function handleResize() {
            setBp(getBreakpoint(window.innerWidth));
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        bp,
        isMobile: bp === 'mobile',
        isTablet: bp === 'tablet',
        isDesktop: bp === 'desktop',
        isMobileOrTablet: bp !== 'desktop',
    };
}
