import { useEffect, useRef } from 'react';
import './ScrollStack.css';

export default function ScrollStack({
    children,
    className = '',
    itemDistance = 40,
    itemScale = 0.04,
    stackPosition = 120
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const cards = container.querySelectorAll('.scroll-stack-card');
            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const cardTop = rect.top;

                if (cardTop <= stackPosition + index * itemDistance) {
                    const diff = (stackPosition + index * itemDistance) - cardTop;
                    const scaleFactor = Math.max(0.88, 1 - index * itemScale);
                    const opacityFactor = Math.max(0.75, 1 - (cards.length - 1 - index) * 0.05);

                    card.style.position = 'sticky';
                    card.style.top = `${stackPosition + index * itemDistance}px`;
                    card.style.transform = `scale(${scaleFactor})`;
                    card.style.opacity = `${opacityFactor}`;
                    card.style.zIndex = `${index + 1}`;
                } else {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [itemDistance, itemScale, stackPosition]);

    return (
        <div ref={containerRef} className={`scroll-stack-container ${className}`}>
            {children}
        </div>
    );
}

