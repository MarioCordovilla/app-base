import { Component } from "@nestjs/common";
import { sign } from 'jsonwebtoken';
import { SETTINGS } from '../../../environments/environment';
import { ROLE, STATUS } from "../../core/shared/enums";
import { BadRequestException, NotFoundException } from '../../core/shared/exceptions';
import { LoggerService } from "../../core/shared/logger.service";
import { UsersService } from "../users/users.service";
import { IUser, User } from './../users/users.models';
import { ICredential } from './credentials.models';
import {
  IUserClientRegistration,
  IUserCredential,
  IUserGodRegistration,
  IUserInvitation,
  IUserPublicRegistration,
  IUserToken
} from "./credentials.models";
import { CredentialsService } from "./credentials.service";

@Component()
export class CredentialsLogic {
  private logger: LoggerService = new LoggerService('CredentialsLogic');
  constructor(
    private credentialsService: CredentialsService,
    private usersService: UsersService) { }

  public async postUserClientRegistration(userRegistration: IUserClientRegistration) {
    let newUser = this.createUserFromUserClientRegistration(userRegistration);
    newUser = await this.usersService.post(newUser);
    newUser = await this.postCredential(newUser, userRegistration.password);
    this.sendConfirmationEmail(newUser);
    return newUser;
  }
  public async postUserGodRegistration(userGodRegistration: IUserGodRegistration) {
    let newUser = this.createUserFromUserGodRegistration(userGodRegistration);
    newUser = await this.usersService.post(newUser);
    newUser = await this.postCredential(newUser, userGodRegistration.password);
    this.sendConfirmationEmail(newUser);
    return newUser;
  }

  public async postUserPublicRegistration(userRegistration: IUserPublicRegistration) {
    let newUser = this.createUserFromUserPublicRegistration(userRegistration);
    newUser = await this.usersService.post(newUser);
    this.sendConfirmationEmail(newUser);
    return newUser;
  }

  public async postUserInvitation(userInvitation: IUserInvitation) {
    let newUser = this.createUserFromUserInvitation(userInvitation);
    newUser = await this.usersService.post(newUser);
    this.sendConfirmationEmail(newUser);
    return newUser;
  }

  public async getUserToken(userCredential: IUserCredential): Promise<string> {
    const user = await this.usersService.getByEmail(userCredential.email);
    if (!user) {
      throw new NotFoundException('Invalid User');
    }
    const credential = await this.credentialsService.getByUserIdPassword(user._id, userCredential.password);
    if (!credential) {
      throw new NotFoundException('Invalid Credential');
    }
    const token = sign(JSON.stringify(user), SETTINGS.secret);
    return token;
  }

  private createUserFromUserGodRegistration(userRegistration: IUserGodRegistration) {
    const newUser: IUser = {
      email: userRegistration.email,
      name: userRegistration.name,
      roles: [ROLE.GOD],
      status: STATUS.ACTIVE
    };
    return newUser;
  }

  private createUserFromUserClientRegistration(userRegistration: IUserClientRegistration) {
    const newUser: IUser = {
      email: userRegistration.email,
      organizationId: userRegistration.organizationId,
      name: userRegistration.name,
      roles: [ROLE.CLIENT],
      status: STATUS.PENDING
    };
    return newUser;
  }

  private createUserFromUserPublicRegistration(userRegistration: IUserPublicRegistration) {
    const newUser: IUser = {
      email: userRegistration.email,
      organizationId: userRegistration.organizationId,
      name: userRegistration.name,
      phone: userRegistration.phone,
      roles: [ROLE.PUBLIC],
      status: STATUS.PENDING
    };
    return newUser;
  }

  private createUserFromUserInvitation(userInvitation: IUserInvitation) {
    const newUser: IUser = {
      email: userInvitation.email,
      organizationId: userInvitation.organizationId,
      name: userInvitation.name,
      roles: [userInvitation.role],
      status: STATUS.PENDING
    };
    return newUser;
  }

  private async postCredential(newUser: IUser, password: string) {
    const credential: ICredential = {
      userId: newUser._id,
      password
    };

    try {
      await this.credentialsService.post(credential);
    } catch (err) {
      this.logger.error(err);
      await this.usersService.remove(newUser._id);
      newUser = null;
    }
    return newUser;
  }

  private async sendConfirmationEmail(newUser: IUser): Promise<boolean> {
    return true;
  }
}
