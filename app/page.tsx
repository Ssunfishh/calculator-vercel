"use client";
import { useState } from 'react';

const numButtons = ['7','8','9','/', '4','5','6','*', '1','2','3','-', '0','.','=', '+'];
const sciButtons = ['sin','cos','tan','(', 'log','sqrt','pow',')', 'pi','e','1/x','+/-', 'n!'];

function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

function safeEval(expr: string): string {
  try {
    // Replace functions and constants
    let safeExpr = expr
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log10')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/pow/g, 'Math.pow')
      .replace(/pi/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/(\d+)!\s*$/g, (match, num) => factorial(Number(num)).toString())
      .replace(/1\/x/g, '1/(')
      .replace(/\+\/-/g, '*-1');
    
    // eslint-disable-next-line no-new-func
    const result = Function(`'use strict'; return (${safeExpr || '0'})`)();
    return Number.isFinite(result) ? String(result) : 'Error';
  } catch {
    return 'Error';
  }
}

export default function Page() {
  const [expr, setExpr] = useState('');

  function onPress(key: string) {
    if (key === '=') {
      const result = safeEval(expr);
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
    setExpr(prev => prev === 'Error' ? key : prev + key);
  }

  return (
    <div className="container">
      <input className="display" value={expr} readOnly aria-label="Calculator display" />
      <div className="grid" role="group" aria-label="Calculator keys">
        <button className="btn wide" onClick={() => onPress('AC')}>AC</button>
        <button className="btn" onClick={() => onPress('⌫')}>⌫</button>
        <button className="btn sci fn" onClick={() => onPress('sin')}>sin</button>
        <button className="btn sci fn" onClick={() => onPress('cos')}>cos</button>
        <button className="btn op" onClick={() => onPress('/')}>÷</button>
        <button className="btn" onClick={() => onPress('7')}>7</button>
        <button className="btn" onClick={() => onPress('8')}>8</button>
        <button className="btn" onClick={() => onPress('9')}>9</button>
        <button className="btn sci fn" onClick={() => onPress('log')}>log</button>
        <button className="btn op" onClick={() => onPress('*')}>×</button>
        <button className="btn" onClick={() => onPress('4')}>4</button>
        <button className="btn" onClick={() => onPress('5')}>5</button>
        <button className="btn" onClick={() => onPress('6')}>6</button>
        <button className="btn sci fn" onClick={() => onPress('sqrt')}>√</button>
        <button className="btn op" onClick={() => onPress('-')}>-</button>
        <button className="btn" onClick={() => onPress('1')}>1</button>
        <button className="btn" onClick={() => onPress('2')}>2</button>
        <button className="btn" onClick={() => onPress('3')}>3</button>
        <button className="btn sci" onClick={() => onPress('pi')}>π</button>
        <button className="btn op" onClick={() => onPress('+')}>+</button>
        <button className="btn wide" onClick={() => onPress('0')}>0</button>
        <button className="btn" onClick={() => onPress('.')}>.</button>
        <button className="btn sci fn" onClick={() => onPress('(')}>(</button>
        <button className="btn sci fn" onClick={() => onPress(')')}>)</button>
        <button className="btn eq" onClick={() => onPress('=')}>=</button>
      </div>
      <div className="footer">Scientific Calculator • Next.js • Vercel • MIT</div>
    </div>
  );
}
