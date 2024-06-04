import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const FractalScene = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // Вершинный шейдер
    const vertexShaderSource = `
      attribute vec4 a_position;
      void main() {
        gl_Position = a_position;
      }
    `;

    // Фрагментный шейдер
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float time;

      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }

      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }

      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      float perlin3(vec3 coord, float x) {
        float n = 0.0;
        n = x * abs(snoise(coord));
        return n;
      }

      void main(void) {
        vec2 uv = gl_FragCoord.xy / vec2(3000.0, 3000.0);
        vec3 coord = vec3(uv.xy, -time / 2.0);

        float na = perlin3(coord, 10.0);
        float n = na;

        vec3 colors = vec3(
          (1.0 / 255.0) * (255.0 - (255.0 * (1.0 - sin(n + 5.0 * uv.x)) / 2.0)), 
          (1.0 / 255.0) * (255.0 - (255.0 * (1.0 - cos(n + 5.0 * uv.x)) / 2.0)), 
          (1.0 / 255.0) * (255.0 - (255.0 * (1.0 + sin(n + 5.0 * uv.x)) / 2.0))
        );

        gl_FragColor = vec4(colors.r, colors.g, colors.b, 1.0);
      }
    `;

    // Создание шейдера
    const createShader = (gl, sourceCode, type) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        throw `Could not compile WebGL program. \n\n ${info}`;
      }
      return shader;
    };

    // Инициализация шейдеров
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    // Создание программы
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw `Could not compile WebGL program. \n\n ${info}`;
    }

    gl.useProgram(program);

    // Создание буфера
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
        1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
        1.0, -1.0,
        1.0,  1.0
      ]),
      gl.STATIC_DRAW
    );

    // Передача атрибута позиции
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Передача униформов
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    const timeLocation = gl.getUniformLocation(program, "time");

    // Инициализация анимации
    let lastUpdate = new Date().getTime();
    let timer = 0.0;

    const render = (timeDelta) => {
      timer += (timeDelta ? timeDelta / 10000 : 0.05);
      gl.uniform1f(timeLocation, timer); 

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const animate = () => {
      const currentTime = new Date().getTime();
      const timeSinceLastUpdate = currentTime - lastUpdate;
      lastUpdate = currentTime;

      render(timeSinceLastUpdate);
      
      window.requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const height = document.body.clientHeight;
      const width = document.body.clientWidth;

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default FractalScene;
