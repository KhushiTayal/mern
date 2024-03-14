// custom.d.ts
declare namespace Express {
    interface Request {
      user?: { userId: string }; // Add your custom user property
    }
  }
  