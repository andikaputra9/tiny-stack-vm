import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const T={0:[0,0,0],1:[1,0,1],2:[4,0,1],3:[0,1,0],4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],64:[0,1,1],65:[0,2,0],80:[0,1,0],81:[0,1,0],82:[0,0,1],83:[0,1,0]};
for(let i=16;i<35;i++)i!==31&&(T[i]=[0,2,1]);
T[23]=T[27]=[0,1,1];

function run(p, q) {
  const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),u=new Uint8Array(65536);
  let s=0,g=0,pc=0,st=0,ip=0,ol=0;
  const n=p.length;
  const R=x=>({o:u.slice(0,ol),c:x});
  for(;;){
    if(st===1e6)return R(10);
    if(pc<0||pc>=n)return R(9);
    const op=p[pc],t=T[op];
    if(!t)return R(5);
    const[im,po,pu]=t;
    if (pc + im >= n) return R(9);
    st++;
    const nx = pc + 1 + im;
    if (s < po) return R(2);
    if (s - po + pu > 256) return R(3);
    pc = nx;
    if(op>=16&&op<35){
      if(op===23){D[s-1]=-D[s-1]|0;continue;}
      if(op===27){D[s-1]=~D[s-1];continue;}
      const b=D[s-1],a=D[s-2];
      let r;
      if(op===16)r=a+b|0;
      else if(op===17)r=a-b|0;
      else if(op===18)r=Math.imul(a,b);
      else if(op===19){if(!b)return R(4);r=(a/b)|0;}
      else if(op===20){if(!b)return R(4);r=a%b|0;}
      else if(op===21){if(!b)return R(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
      else if(op===22){if(!b)return R(4);r=(a>>>0)%(b>>>0)|0;}
      else if(op===24)r=a&b;
      else if(op===25)r=a|b;
      else if(op===26)r=a^b;
      else if(op===28)r=a<<(b&31);
      else if(op===29)r=a>>(b&31);
      else if(op===30)r=a>>>(b&31)|0;
      else if(op===32)r=a===b?1:0;
      else if(op===33)r=a<b?1:0;
      else r=(a>>>0)<(b>>>0)?1:0;
      s-=2;D[s++]=r;continue;
    }
    switch (op) {
      case 0: return R(0);
      case 1: D[s++] = (p[nx - 1] << 24) >> 24; break;
      case 2: D[s++] = p[nx - 4] | (p[nx - 3] << 8) | (p[nx - 2] << 16) | (p[nx - 1] << 24); break;
      case 3: s--; break;
      case 4: D[s] = D[s - 1]; s++; break;
      case 5: { const t = D[s - 1]; D[s - 1] = D[s - 2]; D[s - 2] = t; break; }
      case 6: D[s] = D[s - 2]; s++; break;
      case 7: { const a = D[s - 3]; D[s - 3] = D[s - 2]; D[s - 2] = D[s - 1]; D[s - 1] = a; break; }
      case 48: case 49: case 50: {
        const rel = ((p[nx - 2] | (p[nx - 1] << 8)) << 16) >> 16;
        if (op === 48 || (op === 49) === (D[--s] === 0)) pc = nx + rel;
        break;
      }
      case 51:
        if (g === 64) return R(7);
        C[g++] = nx; pc = p[nx - 2] | (p[nx - 1] << 8); break;
      case 52:
        if (!g) return R(8);
        pc = C[--g]; break;
      case 64: {
        const a = D[s - 1];
        if (a < 0 || a > 255) return R(6);
        D[s - 1] = M[a]; break;
      }
      case 65: {
        const a = D[s - 1], v = D[s - 2];
        if (a < 0 || a > 255) return R(6);
        s -= 2; M[a] = v; break;
      }
      case 80: {
        const z = String(D[s - 1]);
        if (ol + z.length > 65536) return R(11);
        s--;
        for (let i = 0; i < z.length; i++) u[ol++] = z.charCodeAt(i);
        break;
      }
      case 81:
        if (ol + 1 > 65536) return R(11);
        u[ol++] = D[--s] & 255; break;
      case 82: D[s++] = ip < q.length ? q[ip++] : -1; break;
      case 83: return R(D[--s] & 255);
    }
  }
}

const I=process.env.MAKEFUN_INPUT_DIR??'/input';
const O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const d of readdirSync(I).sort()){
  const r=run(readFileSync(join(I,d,'program.bin')),readFileSync(join(I,d,'input.bin')));
  mkdirSync(join(O,d),{recursive:true});
  writeFileSync(join(O,d,'stdout.bin'),r.o);
  writeFileSync(join(O,d,'exit.txt'),r.c+'\n');
}
