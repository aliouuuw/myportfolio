"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Vertex shader source
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader source - beautiful, slow, fluid marble noise
    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_dark_mode; // 1.0 for dark, 0.0 for light

      // Simple noise functions
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626, // -1.0 + 2.0 * C.x
                            0.024390243902439); // 1.0 / 41.0
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx) ;
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0) )
          + i.x + vec3(0.0, i1.x, 1.0) );
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0 ;
        vec3 h = abs(x) - 0.5 ;
        vec3 a0 = x - floor(x + 0.5);
        vec3 g = a0 * vec3(m.x, m.y, m.z) + h * vec3(m.x, m.y, m.z);
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Slow, organic movement
        vec2 offset = vec2(u_time * 0.015, u_time * 0.01);
        
        // Add subtle mouse attraction
        vec2 mouseNormalized = u_mouse / u_resolution;
        vec2 toMouse = mouseNormalized - (gl_FragCoord.xy / u_resolution);
        float distToMouse = length(toMouse);
        
        // Distort coordinates with nested noise (domain warping)
        float n1 = snoise(st * 1.5 + offset + toMouse * 0.05);
        float n2 = snoise(st * 2.5 + vec2(n1 * 0.5) - offset * 0.5);
        
        // Color interpolation based on theme
        vec3 color = vec3(0.0);
        
        if (u_dark_mode > 0.5) {
          // Deep velvety graphite, dark steel blue, subtle warm bronze peak
          vec3 baseColor = vec3(0.07, 0.08, 0.10); // Cool graphite
          vec3 secondaryColor = vec3(0.12, 0.14, 0.18); // Dark steel blue
          vec3 peakColor = vec3(0.18, 0.16, 0.15); // Subtle warm bronze accent
          
          float mixVal = smoothstep(-0.5, 0.8, n2);
          float peakVal = smoothstep(0.3, 0.9, n1);
          
          color = mix(baseColor, secondaryColor, mixVal);
          color = mix(color, peakColor, peakVal * 0.3);
          
          // Subtle mouse light in dark mode
          color += vec3(0.03, 0.04, 0.06) * (1.0 - smoothstep(0.0, 0.4, distToMouse));
        } else {
          // Soft pearl, cool silver-blue, clean canvas
          vec3 baseColor = vec3(0.95, 0.96, 0.97); // Cool canvas
          vec3 secondaryColor = vec3(0.91, 0.92, 0.95); // Silver-blue wave
          vec3 peakColor = vec3(0.98, 0.97, 0.95); // Cream/pearl peak
          
          float mixVal = smoothstep(-0.5, 0.8, n2);
          float peakVal = smoothstep(0.3, 0.9, n1);
          
          color = mix(baseColor, secondaryColor, mixVal);
          color = mix(color, peakColor, peakVal * 0.4);
          
          // Subtle mouse glow in light mode
          color += vec3(0.02, 0.02, 0.03) * (1.0 - smoothstep(0.0, 0.3, distToMouse));
        }

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Helper to compile shaders
    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Look up uniforms and attributes
    const positionLoc = gl.getAttribLocation(program, "position");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const darkModeLoc = gl.getUniformLocation(program, "u_dark_mode");

    // Position buffer for a full-screen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Mouse tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = window.innerHeight - e.clientY; // Flip Y for WebGL coords
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", resize);
    resize();

    // Render loop
    let animationFrameId: number;
    const startTime = performance.now();

    const render = () => {
      const currentTime = (performance.now() - startTime) * 0.001;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      gl.clear(gl.COLOR_BUFFER_BIT);

      // Set uniforms
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform1f(timeLoc, currentTime);
      gl.uniform2f(mouseLoc, mouseX * (window.devicePixelRatio || 1), mouseY * (window.devicePixelRatio || 1));
      gl.uniform1f(darkModeLoc, themeRef.current === "dark" ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 transition-opacity duration-1000"
      style={{ opacity: 0.85 }}
    />
  );
}
