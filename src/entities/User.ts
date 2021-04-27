import { IsEmail, MinLength } from "class-validator";
import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";

import Entity from "./Entity";
import Post from "./Post";
import Vote from "./Vote";

@TOEntity("users")
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail(undefined, { message: "Must be a avlid email address" })
  @MinLength(1, { message: "Email is empty" })
  @Column()
  email: string;

  @Index()
  @MinLength(3, { message: "Must be at least 3 characters long" })
  @Column()
  username: string;

  @Column()
  @Exclude()
  @MinLength(6, { message: "Must be at least 3 characters long" })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Array<Post>;

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Array<Vote>;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
