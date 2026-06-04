document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================
    // 1. PRELOADER
    // ============================================
    const preloader = document.querySelector('.preloader');

    function finishPreloader() {
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 800);

        // Trigger hero entrance after preloader
        if (!prefersReducedMotion) {
            gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' });
            gsap.to('.hero-title .word', { y: '0%', duration: 1.4, stagger: 0.08, delay: 0.4, ease: 'power4.out' });
            gsap.fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power2.out' });
            gsap.fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 1.0, ease: 'power2.out' });
        }
    }

    // Wait a minimum time for visual effect, then finish
    setTimeout(finishPreloader, 1000);

    // ============================================
    // 2. NAV SCROLL STATE
    // ============================================
    const nav = document.querySelector('.site-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ============================================
    // 3. WEBGL HERO MESH GRADIENT (Three.js)
    // ============================================
    const canvas = document.getElementById('hero-canvas');
    if (canvas && window.innerWidth > 900) {
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        } catch (e) {
            console.warn('WebGL not supported');
        }

        if (renderer) {
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            const geometry = new THREE.PlaneGeometry(2, 2);

            const uniforms = {
                u_time: { value: 0 },
                u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
                u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
            };

            const material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: `
                    void main() {
                        gl_Position = vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    precision mediump float;
                    uniform float u_time;
                    uniform vec2 u_mouse;
                    uniform vec2 u_resolution;

                    // Simplex 2D noise algorithm for organic fluid motion
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
                        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0) )
                        + i.x + vec3(0.0, i1.x, 1.0) );
                        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                          dot(x12.zw,x12.zw)), 0.0);
                        m = m*m ;
                        m = m*m ;
                        vec3 x = 2.0 * fract(p * C.www) - 1.0;
                        vec3 h = abs(x) - 0.5;
                        vec3 a0 = x - floor(x + 0.5);
                        vec3 g = a0 * vec3(x0.x, x12.x, x12.z) + h * vec3(x0.y, x12.y, x12.w);
                        vec3 r = 1.79284291400159 - 0.85373472095314 * ( g*g + h*h );
                        g *= r;
                        m *= g;
                        return 130.0 * dot(m, vec3(1.0));
                    }

                    void main() {
                        vec2 uv = gl_FragCoord.xy / u_resolution;
                        vec2 mouse = u_mouse / u_resolution;

                        // Organic wave movement from dual-frequency noise
                        float n1 = snoise(uv * 1.1 + vec2(u_time * 0.02, u_time * 0.015));
                        float n2 = snoise(uv * 2.2 - vec2(u_time * 0.015, -u_time * 0.025));

                        // Slowly shifting centers modulated by noise & mouse
                        vec2 c1 = vec2(0.3, 0.4) + vec2(n1 * 0.1, n2 * 0.08) + (mouse - 0.5) * 0.03;
                        vec2 c2 = vec2(0.7, 0.6) + vec2(n2 * 0.12, n1 * 0.06) + (mouse - 0.5) * 0.03;
                        vec2 c3 = vec2(0.5, 0.5) + vec2(sin(u_time * 0.04) * 0.08, cos(u_time * 0.05) * 0.08);

                        float d1 = distance(uv, c1);
                        float d2 = distance(uv, c2);
                        float d3 = distance(uv, c3);

                        // Very large, ultra-soft glowing blobs
                        float b1 = smoothstep(0.7, 0.0, d1);
                        float b2 = smoothstep(0.6, 0.0, d2);
                        float b3 = smoothstep(0.8, 0.0, d3);

                        // Extremely subtle premium pastel / alabaster tones
                        // Base canvas color is warm sandstone white: oklch(0.985 0.003 70) => vec3(0.985, 0.982, 0.978)
                        vec3 baseColor = vec3(0.985, 0.982, 0.976);

                        // Soft lavender/indigo: oklch(0.95 0.015 280) => vec3(0.94, 0.94, 0.97)
                        vec3 col1 = vec3(0.945, 0.941, 0.98);

                        // Soft sand/cream glow: oklch(0.97 0.008 80) => vec3(0.97, 0.965, 0.95)
                        vec3 col2 = vec3(0.98, 0.972, 0.96);

                        // Milk white highlight
                        vec3 col3 = vec3(1.0, 1.0, 1.0);

                        vec3 color = mix(baseColor, col1, b1 * 0.45);
                        color = mix(color, col2, b2 * 0.35);
                        color = mix(color, col3, b3 * 0.25);

                        gl_FragColor = vec4(color, 1.0);
                    }
                `
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Mouse tracking for shader
            let targetMouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
            document.addEventListener('mousemove', (e) => {
                targetMouse.x = e.clientX;
                targetMouse.y = window.innerHeight - e.clientY; // flip Y for GL
            });

            // Animation loop
            let animationId;
            function animate() {
                animationId = requestAnimationFrame(animate);
                uniforms.u_time.value += 0.01;

                // Smooth mouse lerp
                uniforms.u_mouse.value.x += (targetMouse.x - uniforms.u_mouse.value.x) * 0.05;
                uniforms.u_mouse.value.y += (targetMouse.y - uniforms.u_mouse.value.y) * 0.05;

                renderer.render(scene, camera);
            }
            animate();

            // Resize handler
            window.addEventListener('resize', () => {
                renderer.setSize(window.innerWidth, window.innerHeight);
                uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
            });
        }
    }

    // ============================================
    // 4. MARQUEE
    // ============================================
    const marqueeText = document.querySelector('.marquee-text');
    if (marqueeText) {
        // Duplicate for seamless loop
        const clone = marqueeText.cloneNode(true);
        marqueeText.parentElement.appendChild(clone);

        gsap.to('.marquee-text', {
            xPercent: -100,
            repeat: -1,
            duration: 30,
            ease: 'linear'
        });
    }

    // ============================================
    // 5. GSAP STICKY STACK (Work Section)
    // ============================================
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray('.work-card');
    
    // Cards spotlight movement (runs on all screens with hover capability)
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    if (cards.length > 0 && !prefersReducedMotion && window.innerWidth > 900) {
        cards.forEach((card, i) => {
            if (i === cards.length - 1) return;

            ScrollTrigger.create({
                trigger: card,
                start: 'top 80px', // pin below nav
                endTrigger: cards[cards.length - 1],
                end: 'top 80px',
                pin: true,
                pinSpacing: false,
            });

            gsap.to(card, {
                scale: 0.94,
                filter: 'brightness(0.92)',
                ease: 'none',
                scrollTrigger: {
                    trigger: cards[i + 1],
                    start: 'top bottom',
                    end: 'top 80px',
                    scrub: true,
                }
            });
        });
    }

    // ============================================
    // 6. WRITING LIST HOVER PREVIEW
    // ============================================
    const preview = document.querySelector('.writing-preview');
    const previewImg = preview.querySelector('img');
    const writingRows = document.querySelectorAll('.writing-row');

    if (preview && window.innerWidth > 900) {
        // Use gsap.quickTo for buttery smooth following
        const xTo = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });

        writingRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
                const imgUrl = row.getAttribute('data-image');
                previewImg.src = imgUrl;
                preview.classList.add('visible');
            });

            row.addEventListener('mouseleave', () => {
                preview.classList.remove('visible');
            });

            row.addEventListener('mousemove', (e) => {
                xTo(e.clientX);
                yTo(e.clientY);
            });
        });
    }

    // ============================================
    // 7. GENERAL SCROLL REVEALS
    // ============================================
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el, i) => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: i * 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Work header reveal
    gsap.fromTo('.work-header', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.work-header', start: 'top 88%' }
    });

    // Writing header reveal
    gsap.fromTo('.writing-header', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.writing-header', start: 'top 88%' }
    });
});
