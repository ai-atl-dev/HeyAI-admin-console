"use client"

import { useEffect, useRef } from "react"

export function BreathingField() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext("webgl")
        if (!gl) return

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `

        const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
        uv.x *= iResolution.x / iResolution.y;

        float t = iTime * 0.25;
        float n = noise(uv * 2.0 + t);

        float d = length(uv);
        float breathing = 0.5 + 0.5 * sin(iTime * 1.5);
        float intensity = exp(-10.0 * pow(d - 0.3*n, 2.0)) * (0.6 + 0.4 * breathing);

        float glow = exp(-3.0 * d) * 1.5;
        vec3 color = vec3(0.2 + 0.8 * n, 0.5 + 0.5 * n, 1.0) * (intensity + glow);

        color += pow(color, vec3(2.0)) * 0.5;
        gl_FragColor = vec4(color, 1.0);
      }
    `

        function compileShader(type: number, source: string) {
            if (!gl) return null
            const shader = gl.createShader(type)
            if (!shader) return null
            gl.shaderSource(shader, source)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader))
                return null
            }
            return shader
        }

        const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource)

        if (!vertexShader || !fragmentShader || !gl) return

        const program = gl.createProgram()
        if (!program) return

        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)

        const positionBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW
        )

        const positionLoc = gl.getAttribLocation(program, "a_position")
        gl.enableVertexAttribArray(positionLoc)
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

        const iResolutionLoc = gl.getUniformLocation(program, "iResolution")
        const iTimeLoc = gl.getUniformLocation(program, "iTime")

        let animationId: number

        function render(time: number) {
            if (!gl || !canvas) return

            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.uniform2f(iResolutionLoc, canvas.width, canvas.height)
            gl.uniform1f(iTimeLoc, time * 0.001)
            gl.drawArrays(gl.TRIANGLES, 0, 6)

            animationId = requestAnimationFrame(render)
        }

        render(0)

        const handleResize = () => {
            if (!canvas) return
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
        }

        window.addEventListener("resize", handleResize)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return <canvas ref={canvasRef} className="w-full h-full" />
}
