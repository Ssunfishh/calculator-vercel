"use client";
import { useState } from 'react';

const buttons = [
  '7','8','9','/',
  '4','5','6','*',
  '1','2','3','-',
  '0','.','=','+',
];

export default function Page() {
  const [expr, setExpr] = useState('');

  function onPress(key: string) {
    if (key === '=') {
      try {
        // eslint-disable-next-line no-new-func
        const result = Function(`return (${expr || '0'})`)();
        setExpr(String(result));
      } catch {
        setExpr('Error');
      }
      return;
    }
    setExpr(prev => prev === 'Error' ? key : prev + key);
  }

  function clearAll() { setExpr(''); }
  function backspace() { setExpr(prev => prev.slice(0, -1)); }

  return (
    <div className="container">
      <input className="display" value={expr} readOnly aria-label="Calculator display" />
      <div className="grid" role="group" aria-label="Calculator keys">
        <button className="btn wide" onClick={clearAll}>AC</button>
        <button className="btn" onClick={backspace}>⌫</button>
        <button className="btn op" onClick={() => onPress('/')}>÷</button>
        <button className="btn" onClick={() => onPress('7')}>7</button>
        <button className="btn" onClick={() => onPress('8')}>8</button>
        <button className="btn" onClick={() => onPress('9')}>9</button>
        <button className="btn op" onClick={() => onPress('*')}>×</button>
        <button className="btn" onClick={() => onPress('4')}>4</button>
        <button className="btn" onClick={() => onPress('5')}>5</button>
        <button className="btn" onClick={() => onPress('6')}>6</button>
        <button className="btn op" onClick={() => onPress('-')}>−</button>
        <button className="btn" onClick={() => onPress('1')}>1</button>
        <button className="btn" onClick={() => onPress('2')}>2</button>
        <button className="btn" onClick={() => onPress('3')}>3</button>
        <button className="btn op" onClick={() => onPress('+')}>+</button>
        <button className="btn wide" onClick={() => onPress('0')}>0</button>
        <button className="btn" onClick={() => onPress('.')}>.</button>
        <button className="btn eq" onClick={() => onPress('=')}>=</button>
      </div>
      <div className="footer">Next.js • Vercel-ready • MIT</div>
    </div>
  );
}
