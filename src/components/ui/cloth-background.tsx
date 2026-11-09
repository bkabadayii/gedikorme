"use client";

import { useEffect, useRef } from "react";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision highp float;uniform vec2 R;uniform float S;
float h(vec2 u){
 u+=0.18*vec2(sin(u.y*2.1+1.3),cos(u.x*1.7));
 float f=sin(u.x*2.2+u.y*1.1)*.50+sin(u.x*4.7-u.y*2.3+1.7)*.22+sin(u.y*3.1+u.x*.6+4.)*.30+sin((u.x+u.y)*7.3)*.06;
 return f;}
float knit(vec2 u){
 vec2 g=vec2(u.x*90.,u.y*70.);vec2 q=fract(g)-.5;
 float col=abs(q.x*2.);
 float rib=smoothstep(.0,.5,.5-abs(fract(g.x)-.5));
 float loop=sin(3.14159*(q.y+.5+col*.35));
 return clamp(loop*.7+rib*.3,0.,1.);}
void main(){vec2 uv=gl_FragCoord.xy/R;uv.y=1.-uv.y;
 vec2 u=uv*vec2(R.x/R.y,1.)*2.6+vec2(S*.35,S*.1);
 float e=.003;float H=h(u);
 vec3 n=normalize(vec3(-(h(u+vec2(e,0.))-H)/e*.12,-(h(u+vec2(0.,e))-H)/e*.12,1.));
 float k=knit(u+H*.02);
 n=normalize(n+vec3((k-.5)*.07,(k-.5)*.05,0.));
 vec3 L=normalize(vec3(-.5,.6,.65));
 float d=clamp(dot(n,L),0.,1.);float sh=smoothstep(-.9,.9,H);
 vec3 base=mix(vec3(.86,.84,.79),vec3(.89,.87,.82),k);
 vec3 col=base*(.84+.2*d)*(.95+.05*sh);
 col+=pow(clamp(dot(reflect(-L,n),vec3(0.,0.,1.)),0.,1.),22.)*.04;
 col*=mix(.92,1.,smoothstep(1.25,.35,length(uv-.5)*1.4));
 gl_FragColor=vec4(col,1.);}`;

/** Fixed, lit knit-cloth ground. Renders once and on resize and
 *  falls back to the stone gradient when WebGL is unavailable. Procedural, not a photo. */
export function ClothBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl");
    if (!canvas || !gl) return;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "R");
    const uS = gl.getUniformLocation(prog, "S");
    let raf = 0;

    const draw = () => {
      raf = 0;
      const dpr = 1;
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uR, w, h);
      gl.uniform1f(uS, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(draw); };
    draw();
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("resize", schedule);
            if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
