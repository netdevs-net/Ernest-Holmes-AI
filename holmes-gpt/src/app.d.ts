declare global {
  namespace App {
    interface Locals {
      /** Server-issued, httpOnly identifier for this browser. */
      sessionId: string;
    }
  }
}

export {};
