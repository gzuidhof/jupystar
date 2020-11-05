// Custom error messages, note we have to patch the prototype of the
// errors to fix `instanceof` calls, see:
// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work


export class JupystarError extends Error {
    constructor(reason: string) {
        super(reason);
        Object.setPrototypeOf(this, JupystarError.prototype);
    }
}

export class BackwardsCompatibilityError extends JupystarError {
    constructor(reason: string) {
        super(reason);
        Object.setPrototypeOf(this, BackwardsCompatibilityError.prototype);
    }
}

