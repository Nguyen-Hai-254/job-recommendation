import { Response } from 'express';

export default function respondSuccess(res: Response, message: string, data: any = null, status: number = 200) {
  return res.status(status).json({
    message: message,
    status: status,
    data: data
  });
}
