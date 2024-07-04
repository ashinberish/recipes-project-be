import { Response } from "express";
import { isCustomCode } from "../constants/ra-status-codes";

export class RAResponse {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  status: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message?: string, data?: any, status = 200) {
    this.message = message ?? "ok";
    this.data = data ?? null;
    this.status = status;
  }
}

export function handleLNResponse(RAResponse: RAResponse, res: Response): void {
  const { message, data, status } = RAResponse;

  res.status(status);
  if (isCustomCode(status)) {
    res.statusMessage = message;
  }

  res.statusMessage = message;
  if ([301, 302].includes(status)) {
    return res.redirect(data);
  }

  res.json({ message, data });
}
