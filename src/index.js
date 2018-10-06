/*************************************************************************
                          Written by Ali Muhammed
                            uniapi@outlook.com
                              October 5, 2018
*************************************************************************/

const _oparg = new WeakMap();
const _setop = Symbol('setop');
const _remop = Symbol('remop');
const _compute = Symbol('compute');

class SmartCalculator {
  [_compute](arga, op, argb) {
    switch (op) {
    case '**': return arga ** argb;
    case '*': return arga * argb;
    case '/': return arga / argb;
    case '+': return arga + argb;
    case '-': return arga - argb;
    default: return 0;
    }
  }
  [_setop](op, arg) {
    const oparg = _oparg.get(this);
    oparg.ops.push(op);
    oparg.args.push(arg);
    _oparg.set(this, oparg);
    return this;
  }
  [_remop](inx) {
    const oparg = _oparg.get(this);
    oparg.ops.splice(inx, 1);
    oparg.args.splice(inx+1, 1);
    _oparg.set(this, oparg);
  }

  constructor(ininum) {
    _oparg.set(this, { args: [ininum], ops: [] });
  }

  add(num) {
    return this[_setop]('+', num);
  }
  subtract(num) {
    return this[_setop]('-', num);
  }
  multiply(num) {
    return this[_setop]('*', num);
  }
  devide(num) {
    return this[_setop]('/', num);
  }
  pow(num) {
    return this[_setop]('**', num);
  }
  valueOf() {
    const oparg = _oparg.get(this);
    const opset = [["**"],["*","/"],["+","-"]];
    const args = oparg.args;
    const ops = oparg.ops;
    for (const set of opset) {
      if (!ops.length)
        break;
      for (let i=0; i < ops.length; i++) {
        for (let j=0,len=set.length; j < len; ) {
          const op = set[j];
          if (ops[i] == op) {
            if (op == "**" && args[i+1] == 1) {
              if (i+1 < ops.length && op == ops[i+1]) {
                this[_remop](i+1);
                continue;
              }
            }
            args[i] = this[_compute](args[i], op, args[i+1]);
            this[_remop](i--);
            break;
          }
          j++;
        }
      }
    }
    return args[0];
  }
}

module.exports = SmartCalculator;
