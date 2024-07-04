import crypto from "crypto";

class RAError extends Error {
  status: number;
  errorId: string;
  uid?: string;
  constructor(status: number, message?: string, stack?: string, uid?: string) {
    super();
    this.status = status ?? 500;
    this.errorId = crypto.randomUUID();
    this.stack = stack;
    this.uid = uid;

    if (process.env.APP_ENV === "dev") {
      this.message = stack
        ? String(message) + "\nStack: " + String(stack)
        : String(message);
    } else {
      if ((this.stack ?? "") && this.status >= 500) {
        this.stack = this.message + "\n" + this.stack;
        this.message = "Internal Server Error " + this.errorId;
      } else {
        this.message = String(message);
      }
    }
  }
}

export default RAError;
