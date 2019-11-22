const nop = () => {};

export class SimpleEvent {
  private readonly callbacks: (() => void)[] = [];

  subscribe(callback: () => void) {
    if (this.callbacks.indexOf(callback) < 0) {
      this.callbacks.push(callback);
    }
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: () => void) {
    const i = this.callbacks.indexOf(callback);
    if (i >= 0) { this.callbacks.splice(i, 1); }
  }

  trigger() {
    for (var i = this.callbacks.length - 1; i >= 0; i--) {
      try { this.callbacks[i](); }
      catch (error) { }
    }
  }
}

export class SimpleTypedEvent<T> {
  private readonly callbacks: ((value: T) => void)[] = [];

  subscribe(callback: (value: T) => void) {
    if (this.callbacks.indexOf(callback) < 0) {
      this.callbacks.push(callback);
    }
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: (value: T) => void) {
    const i = this.callbacks.indexOf(callback);
    if (i >= 0) { this.callbacks.splice(i, 1); }
  }

  trigger(value: T) {
    for (var i = this.callbacks.length - 1; i >= 0; i--) {
      try { this.callbacks[i](value); }
      catch (error) { }
    }
  }
}

export class SimpleOnceOffEvent {
  private callbacks: (() => void)[] | null = [];
  private fired = false;

  subscribe(callback: () => void) {
    if (this.fired) {
      try { callback(); }
      catch (error) { }
      return nop;
    }
    if (!this.callbacks) { return nop; }
    if (this.callbacks.indexOf(callback) < 0) {
      this.callbacks.push(callback);
    }
    return () => this.unsubscribe(callback);
  }

  unsubscribe(callback: () => void) {
    if (!this.callbacks) { return; }
    const i = this.callbacks.indexOf(callback);
    if (i >= 0) { this.callbacks.splice(i, 1); }
  }

  trigger() {
    this.fired = true;
    if (!this.callbacks) { return; }
    for (var i = this.callbacks.length - 1; i >= 0; i--) {
      try { this.callbacks[i](); }
      catch (error) { }
    }
    this.callbacks = null;
  }
}
