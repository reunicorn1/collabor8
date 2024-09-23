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
    // body will carry the credentials of the user to be invited
    // if username or email is present, then invite the user
    // if username or email is not present, then invite the guest
    // creates a projectShare for the user if invitee is different from inviter
    // no need for projectShare if invitee is the inviter i.e. guest to guest
    // if the user is already a member of the project, then update ttl of the projectShare
    // if invitee is a guest, return accessToken
    // return this.guestService.invite(body, req.user);
  }

  /**
   * triggered when guest clicks on try it out button
   * creates a guest user if it doesnt exist
   * returns the guest user and the accessToken
   */
  @Public()
  @Get('tryout')
  async tryout(
    @Request() req: any,
    @Response() res: any,
  ): Promise<any> {
    // if guest user doesnt exist, create a guest user
    // if guest user exists, return the guest user and the accessToken
    // create a project with the name project-${new Date().getTime()}
    const { user, accessToken, userData } = await this.guestService.tryout();
    req.user = userData; // set user on the request to satisfy the local strategy
    const project = await this.guestService.createOrGetProject(user.user_id);
    user['project'] = project;

    res
      .cookie('accessToken', accessToken, { httpOnly: true, secure: true })
      .status(200)
      .send({ accessToken, user });
  }
}
