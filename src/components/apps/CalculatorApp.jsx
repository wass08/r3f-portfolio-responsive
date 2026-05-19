import React, { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';

/**
 * Calculator App - System Calculator Application
 */
const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num) => {
    // If display currently shows an error, start fresh
    if (display === 'Cannot divide by 0') {
      setDisplay(String(num));
      setWaitingForNewValue(false);
      return;
    }

    if (waitingForNewValue) {
      setDisplay(String(num));
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  const handleOperation = (op) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '*':
        return prev * current;
      case '/':
        if (current === 0) {
          return null; // Signal error
        }
        return prev / current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      
      if (operation === '/' && currentValue === 0) {
        setDisplay('Cannot divide by 0');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(true);
        return;
      }
      
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleBackspace = () => {
    if (display === 'Cannot divide by 0') {
      setDisplay('0');
      return;
    }
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleDecimal = () => {
    if (display === 'Cannot divide by 0') {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }

    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const Button = ({ children, onClick, variant = 'default', className = '' }) => {
    const baseClass = 'h-16 rounded-lg font-semibold text-lg transition-colors';
    const variants = {
      default: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600',
      operation: 'bg-blue-500 text-white hover:bg-blue-600',
      equals: 'bg-green-500 text-white hover:bg-green-600',
      clear: 'bg-red-500 text-white hover:bg-red-600',
    };
    return (
      <button
        onClick={onClick}
        className={`${baseClass} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  // Keyboard support: numbers, operators, Enter, Backspace, C
  useEffect(() => {
    const handleKey = (e) => {
      // Allow typing into other inputs normally
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        e.preventDefault();
        handleNumber(Number(key));
        return;
      }

      if (key === '.') {
        e.preventDefault();
        // prevent multiple decimals
        if (waitingForNewValue) {
          setDisplay('0.');
          setWaitingForNewValue(false);
        } else if (!display.includes('.')) {
          setDisplay(display + '.');
        }
        return;
      }

      if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        handleOperation(key);
        return;
      }

      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEquals();
        return;
      }

      if (key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (key.toLowerCase() === 'c') {
        e.preventDefault();
        handleClear();
        return;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [display, waitingForNewValue, operation, previousValue]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-700 rounded-3xl shadow-2xl p-6 w-full max-w-sm">
        {/* Display */}
        <div className="bg-neutral-900 text-white text-right text-4xl font-bold p-4 rounded-lg mb-6 overflow-hidden truncate">
          {display}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-3">
          <Button onClick={handleClear} variant="clear" className="col-span-2">
            Clear
          </Button>
          <Button onClick={() => handleOperation('/')} variant="operation">
            ÷
          </Button>
          <Button onClick={() => handleOperation('*')} variant="operation">
            ×
          </Button>

          {[7, 8, 9].map((num) => (
            <Button key={num} onClick={() => handleNumber(num)}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleOperation('-')} variant="operation">
            −
          </Button>

          {[4, 5, 6].map((num) => (
            <Button key={num} onClick={() => handleNumber(num)}>
              {num}
            </Button>
          ))}
          <Button onClick={() => handleOperation('+')} variant="operation">
            +
          </Button>

          {[1, 2, 3].map((num) => (
            <Button key={num} onClick={() => handleNumber(num)}>
              {num}
            </Button>
          ))}
          <Button onClick={handleEquals} variant="equals" className="row-span-2">
            =
          </Button>

          <Button onClick={() => handleNumber(0)} className="col-span-2">
            0
          </Button>
          <Button onClick={handleDecimal}>.</Button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorApp;
