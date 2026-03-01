"use client";
import { useState, useCallback } from 'react';

type AngleMode = 'deg' | 'rad';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function safeEval(expr: string, angleMode: AngleMode): string {
  try {
    const toRad = (x: number) => angleMode === 'deg' ? x * DEG_TO_RAD : x;
    const fromRad = (x: number) => angleMode === 'deg' ? x * RAD_TO_DEG : x;
    
    const customSin = (x: number) => Math.sin(toRad(x));
    const customCos = (x: number) => Math.cos(toRad(x));
    const customTan = (x: number) => Math.tan(toRad(x));
    const customAsin = (x: number) => fromRad(Math.asin(x));
    const customAcos = (x: number) => fromRad(Math.acos(x));
    const customAtan = (x: number) => fromRad(Math.atan(x));
    
    const scope = {
      sin: customSin, cos: customCos, tan: customTan,
      asin: customAsin, acos: customAcos, atan: customAtan,
      log: Math.log10, ln: Math.log, log2: Math.log2,
      sqrt: Math.sqrt, cbrt: Math.cbrt,
      abs: Math.abs, ceil: Math.ceil, floor: Math.floor, round: Math.round,
      exp: Math.exp, pow: Math.pow,
      PI: Math.PI, E: Math.E,
      factorial: factorial,
      fact: factorial,
    };
    
    // Replace factorial notation n! -> fact(n)
    let safeExpr = expr
      .replace(/(\d+(?:\.\d+)?)\s*!/g, 'fact($1)')
      .replace(/(\([^)]+\))\s*!/g, 'fact$1');
    
    // Build function from scope
    const fn = new Function(...Object.keys(scope), 'return (' + (safeExpr || '0') + ')');
    const result = fn(...Object.values(scope));
    
    if (!Number.isFinite(result)) return 'Error';
    // Format result nicely
    const formatted = Math.abs(result) < 1e-10 ? 0 : 
                      Math.abs(result) > 1e10 ? result.toExponential(6) :
                      parseFloat(result.toPrecision(12));
    return String(formatted);
  } catch {
    return 'Error';
  }
}

export default function Page() {
  const [expr, setExpr] = useState('');
  const [memory, setMemory] = useState(0);
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [history, setHistory] = useState<string[]>([]);

  const onPress = useCallback((key: string) => {
    if (key === '=') {
      const result = safeEval(expr, angleMode);
      if (result !== 'Error') {
        setHistory(prev => [expr + ' = ' + result, ...prev].slice(0, 5));
      }
      setExpr(result);
      return;
    }
    if (key === '⌫') {
      setExpr(prev => prev.slice(0, -1));
      return;
    }
    if (key === 'AC') {
      setExpr('');
      return;
    }
    if (key === 'MC') { setMemory(0); return; }
    if (key === 'MR') { setExpr(prev => prev + String(memory)); return; }
    if (key === 'M+') { 
      const val = parseFloat(safeEval(expr, angleMode));
      if (!isNaN(val)) setMemory(prev => prev + val);
      return; 
    }
    if (key === 'M-') { 
      const val = parseFloat(safeEval(expr, angleMode));
      if (!isNaN(val)) setMemory(prev => prev - val);
      return; 
    }
    if (key === '1/x') {
      setExpr(prev => prev ? `1/(${prev})` : '1/');
      return;
    }
    if (key === 'x²') {
      setExpr(prev => prev ? `(${prev})^2` : '');
      return;
    }
    if (key === 'xʸ') {
      setExpr(prev => prev ? `(${prev})^` : '');
      return;
    }
    if (key === '√') {
      setExpr(prev => prev ? `sqrt(${prev})` : 'sqrt(');
      return;
    }
    if (key === '±') {
      setExpr(prev => prev ? `-(${prev})` : '-');
      return;
    }
    if (key === 'n!') {
      setExpr(prev => prev ? `(${prev})!` : '');
      return;
    }
    setExpr(prev => prev === 'Error' ? key : prev + key);
  }, [expr, angleMode, memory]);

  const sciButtons = [
    { label: 'sin', val: 'sin(' }, { label: 'cos', val: 'cos(' }, { label: 'tan', val: 'tan(' }, 
    { label: 'asin', val: 'asin(' }, { label: 'acos', val: 'acos(' },
    { label: 'ln', val: 'ln(' }, { label: 'log', val: 'log(' }, { label: 'log₂', val: 'log2(' },
    { label: 'eˣ', val: 'exp(' }, { label: '10ˣ', val: '10^' },
    { label: 'x²', val: 'x²' }, { label: 'xʸ', val: 'xʸ' }, { label: '√', val: '√' }, { label: '∛', val: 'cbrt(' },
    { label: '(', val: '(' }, { label: ')', val: ')' }, { label: 'π', val: 'PI' }, { label: 'e', val: 'E' },
    { label: '|x|', val: 'abs(' }, { label: 'n!', val: 'n!' },
  ];

  const numButtons = ['7','8','9','4','5','6','1','2','3','0','.'];

  return (
    <div className="container">
      <div className="header">
        <h1>Scientific Calculator</h1>
        <button 
          className="mode-toggle" 
          onClick={() => setAngleMode(m => m === 'deg' ? 'rad' : 'deg')}
        >
          {angleMode.toUpperCase()}
        </button>
      </div>
      
      <input className="display" value={expr} readOnly placeholder="0" aria-label="Calculator display" />
      
      {history.length > 0 && (
        <div className="history">
          {history.map((h, i) => <div key={i} className="history-item">{h}</div>)}
        </div>
      )}
      
      <div className="grid" role="group" aria-label="Calculator keys">
        {/* Row 1: MC, MR, M+, M-, AC, ⌫ */}
        <button className="btn mem" onClick={() => onPress('MC')}>MC</button>
        <button className="btn mem" onClick={() => onPress('MR')}>MR</button>
        <button className="btn mem" onClick={() => onPress('M+')}>M+</button>
        <button className="btn mem" onClick={() => onPress('M-')}>M-</button>
        <button className="btn danger" onClick={() => onPress('AC')}>AC</button>
        <button className="btn danger" onClick={() => onPress('⌫')}>⌫</button>
        
        {/* Row 2: Scientific functions */}
        {sciButtons.slice(0, 6).map(b => (
          <button key={b.label} className="btn sci" onClick={() => onPress(b.val)}>{b.label}</button>
        ))}
        
        {/* Row 3: More scientific */}
        {sciButtons.slice(6, 12).map(b => (
          <button key={b.label} className="btn sci" onClick={() => onPress(b.val)}>{b.label}</button>
        ))}
        
        {/* Row 4: Constants, parens */}
        {sciButtons.slice(12, 18).map(b => (
          <button key={b.label} className="btn sci" onClick={() => onPress(b.val)}>{b.label}</button>
        ))}
        
        {/* Row 5-7: Numbers and operators */}
        <button className="btn num" onClick={() => onPress('7')}>7</button>
        <button className="btn num" onClick={() => onPress('8')}>8</button>
        <button className="btn num" onClick={() => onPress('9')}>9</button>
        <button className="btn op" onClick={() => onPress('/')}>/</button>
        <button className="btn sci" onClick={() => onPress('1/x')}>1/x</button>
        <button className="btn sci" onClick={() => onPress('±')}>±</button>
        
        <button className="btn num" onClick={() => onPress('4')}>4</button>
        <button className="btn num" onClick={() => onPress('5')}>5</button>
        <button className="btn num" onClick={() => onPress('6')}>6</button>
        <button className="btn op" onClick={() => onPress('*')}>×</button>
        {sciButtons.slice(18).map(b => (
          <button key={b.label} className="btn sci" onClick={() => onPress(b.val)}>{b.label}</button>
        ))}
        
        <button className="btn num" onClick={() => onPress('1')}>1</button>
        <button className="btn num" onClick={() => onPress('2')}>2</button>
        <button className="btn num" onClick={() => onPress('3')}>3</button>
        <button className="btn op" onClick={() => onPress('-')}>-</button>
        <button className="btn wide eq" onClick={() => onPress('=')}>=</button>
        
        {/* Row 8: 0, ., + */}
        <button className="btn num wide" onClick={() => onPress('0')}>0</button>
        <button className="btn num" onClick={() => onPress('.')}>.</button>
        <button className="btn op" onClick={() => onPress('+')}>+</button>
      </div>
      
      <div className="footer">Scientific Calculator • Next.js • Vercel • {angleMode.toUpperCase()} mode</div>
    </div>
  );
}
