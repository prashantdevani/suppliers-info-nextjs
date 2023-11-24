import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { Response as ExpressResponse } from "express";

@Controller("/")
export class ActivityController {
  @Get()
  async login(@Res() res: ExpressResponse) {
    return res.status(HttpStatus.OK).json({ message: "Hello world" });
  }
}
