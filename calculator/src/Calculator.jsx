import React, { useState } from 'react';

function Calculator() {
    const [currentOperand, setCurrentOperand] = useState('');
    const [previousOperand, setPreviousOperand] = useState('');
    const [operation, setOperation] = useState(undefined);

    const appendNumber = (number) => {
        if (number === '.' && currentOperand.includes('.')) return;
        setCurrentOperand(currentOperand.toString() + number.toString());
    };

    const chooseOperation = (op) => {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        setOperation(op);
        setPreviousOperand(currentOperand);
        setCurrentOperand('');
    };

    const compute = () => {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        setCurrentOperand(computation);
        setOperation(undefined);
        setPreviousOperand('');
    };

    const clear = () => {
        setCurrentOperand('');
        setPreviousOperand('');
        setOperation(undefined);
    };

    const deleteNumber = () => {
        setCurrentOperand(currentOperand.toString().slice(0, -1));
    };

    return (
        <div className="glass-card">
            <h2>Calculator</h2>
            <div className="calc-display">
                {previousOperand} {operation} {currentOperand}
            </div>
            <div className="calc-grid">
                <button className="span-2 btn-danger" onClick={clear}>AC</button>
                <button onClick={deleteNumber}>DEL</button>
                <button onClick={() => chooseOperation('÷')}>÷</button>
                <button onClick={() => appendNumber('1')}>1</button>
                <button onClick={() => appendNumber('2')}>2</button>
                <button onClick={() => appendNumber('3')}>3</button>
                <button onClick={() => chooseOperation('*')}>*</button>
                <button onClick={() => appendNumber('4')}>4</button>
                <button onClick={() => appendNumber('5')}>5</button>
                <button onClick={() => appendNumber('6')}>6</button>
                <button onClick={() => chooseOperation('+')}>+</button>
                <button onClick={() => appendNumber('7')}>7</button>
                <button onClick={() => appendNumber('8')}>8</button>
                <button onClick={() => appendNumber('9')}>9</button>
                <button onClick={() => chooseOperation('-')}>-</button>
                <button onClick={() => appendNumber('.')}>.</button>
                <button onClick={() => appendNumber('0')}>0</button>
                <button className="span-2 btn-primary" onClick={compute}>=</button>
            </div>
        </div>
    );
}

export default Calculator;
