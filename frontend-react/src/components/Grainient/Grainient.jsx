import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './Grainient.css';

const VERT = `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
out vec4 fragColor;

// Simplex-like noise helper
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    vec2 p = uv;
    p.x *= aspect;

    float t = uTime * 0.15;
    float n1 = snoise(p * 1.5 + vec2(t * 0.4, t * 0.2));
    float n2 = snoise(p * 2.0 - vec2(t * 0.3, t * 0.5) + vec2(n1 * 0.4));

    // Dark navy base, violet glow, cyan highlights
    vec3 cBase = vec3(0.031, 0.051, 0.102);    // #080d1a
    vec3 cBlue = vec3(0.145, 0.388, 0.921);    // #2563eb
    vec3 cViolet = vec3(0.486, 0.227, 0.929);  // #7c3aed /* taste-skill-ignore */
    vec3 cCyan = vec3(0.024, 0.714, 0.831);    // #06b6d4

    vec3 color = cBase;
    color = mix(color, cBlue, smoothstep(-0.6, 0.8, n1) * 0.45);
    color = mix(color, cViolet, smoothstep(-0.4, 0.9, n2) * 0.38);
    color = mix(color, cCyan, smoothstep(0.3, 1.2, n1 + n2) * 0.28);

    // Subtle grain texture
    float grain = (fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.035;
    color += vec3(grain);

    fragColor = vec4(color, 1.0);
}
`;

export default function Grainient({ className = '', style = {}, children }) {
    const containerRef = useRef(null);
    const [useFallback, setUseFallback] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Check reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let renderer, program, mesh, animationFrameId;

        try {
            renderer = new Renderer({
                alpha: false,
                antialias: true,
                powerPreference: 'high-performance'
            });

            const gl = renderer.gl;
            if (!gl) {
                setUseFallback(true);
                return;
            }

            container.appendChild(gl.canvas);

            const geometry = new Triangle(gl);
            program = new Program(gl, {
                vertex: VERT,
                fragment: FRAG,
                uniforms: {
                    uTime: { value: 0 },
                    uResolution: { value: [container.clientWidth, container.clientHeight] }
                }
            });

            mesh = new Mesh(gl, { geometry, program });

            const resize = () => {
                if (!container || !renderer) return;
                const width = container.clientWidth || window.innerWidth;
                const height = container.clientHeight || window.innerHeight;
                renderer.setSize(width, height);
                if (program.uniforms.uResolution) {
                    program.uniforms.uResolution.value = [width, height];
                }
            };

            window.addEventListener('resize', resize);
            resize();

            let startTime = performance.now();
            const update = (now) => {
                if (!prefersReducedMotion) {
                    const elapsed = (now - startTime) * 0.001;
                    program.uniforms.uTime.value = elapsed;
                }
                renderer.render({ scene: mesh });
                animationFrameId = requestAnimationFrame(update);
            };

            animationFrameId = requestAnimationFrame(update);

            return () => {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
                if (gl.canvas && gl.canvas.parentNode === container) {
                    container.removeChild(gl.canvas);
                }
                const loseContext = gl.getExtension('WEBGL_lose_context');
                if (loseContext) loseContext.loseContext();
            };
        } catch (err) {
            console.warn('WebGL2 Grainient initialization fallback:', err);
            setUseFallback(true);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={`grainient-container ${useFallback ? 'grainient-fallback' : ''} ${className}`}
            style={style}
        >
            <div className="grainient-content">
                {children}
            </div>
        </div>
    );
}
