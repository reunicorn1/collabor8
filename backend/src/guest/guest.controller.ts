import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  Query,
  BadRequestException,
  Patch,
  Response,
} from '@nestjs/common';
import { GuestService } from '@guest/guest.service';
import { Public } from '@auth/decorators/isPublic.decorator';

@Controller('guest')
export class GuestController {
  constructor(
    private readonly guestService: GuestService,
  ) { }
  /**
   * triggered when user clicks on generate invite link button
   * for guest, we only allow to generate invite link (no username or email)
   * for user, we allow to generate invite link as well as the normal functionality
   * of inviting a user by username or email
   * this handles the following cases:
   * guest to user invite (requires username to be sent from frontend when user
   *                redirects to the invite link)
   *                we check if user is registered then we create a projectShare
   * user to guest invite (
   * guest to guest invite
   * returns projectInfo and accessToken (if guest)
   * consider separating the guest and user invite functionality to separate endpoints
   */
  @Post('invite')
  async invite(
    @Body() body: any,
    @Request() req: any,
  ): Promise<any> {
  }

  @Public()
  @Post('login')
  async tryout(
    @Request() req: any,
    @Response() res: any,
  ): Promise<any> {
    //const { _id } = await this.guestService.createOrGetProject(IP);
    const { user, userData, accessToken } = await this.guestService.login();
    req.user = userData; // set user on the request to satisfy the local strategy

    res.cookie('accessToken', accessToken).status(200).send({ user, accessToken });
  }

  @Public()
  @Get('project')
  async getGuestProject(
    @Query('IP') IP: string,
    @Response() res: any,
  ): Promise<any> {
    const project = await this.guestService.createOrGetProject(IP);

    res.status(200).send({ redirect: project._id });
  }
}
