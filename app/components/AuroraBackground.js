import { useEffect, useRef } from 'react';


function flattenColorPalette(colors) {
    const flattenedColors = {};

    Object.keys(colors).forEach((key) => {
        if (typeof colors[key] === 'object') {
            Object.keys(colors[key]).forEach((subKey) => {
                flattenedColors[`${key}-${subKey}`] = colors[key][subKey];
            });
        } else {
            flattenedColors[key] = colors[key];
        }
    });

    return flattenedColors
}
const AuroraBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add CSS styles and animation
    const styles = `
      .aurora-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        z-index: -1;
      }
      .aurora {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .aurora::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(100deg, var(--white) 0%, var(--white) 7%, transparent 10%, transparent 12%, var(--white) 16%),
          repeating-linear-gradient(100deg, var(--blue-500) 10%, var(--indigo-300) 15%, var(--blue-300) 20%, var(--violet-200) 25%, var(--blue-400) 30%);
        background-size: 300%, 200%;
        background-position: 50% 50%, 50% 50%;
        filter: blur(10px);
        mix-blend-mode: difference;
        pointer-events: none;
      }
      @keyframes aurora {
        from {
          background-position: 50% 50%, 50% 50%;
        }
        to {
          background-position: 350% 50%, 350% 50%;
        }
      }
      .aurora::before {
        animation: aurora 60s linear infinite;
      }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = styles;
    document.head.appendChild(styleSheet);

    // Add variables for colors
    const colors = {
      white: 'gray',
      blue: {
        500: '#3498db',
        300: '#66d9ef',
        400: '#2980b9',
      },
      indigo: {
        300: '#6610f2',
      },
      violet: {
        200: '#7a288a',
      },
    };
    const flattenedColors = flattenColorPalette(colors);
    const newVars = Object.fromEntries(
      Object.entries(flattenedColors).map(([key, val]) => [`--${key}`, val])
    );
    const root = document.documentElement;
    Object.keys(newVars).forEach((key) => {
      root.style.setProperty(key, newVars[key]);
    });
  }, []);

  return (
    <div className="aurora-container" ref={containerRef}>
      <div className="aurora"></div>
    </div>
  );
};

export default AuroraBackground;