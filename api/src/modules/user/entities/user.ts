import { randomUUID } from 'crypto';

export interface UserSchema {
  email: string;
  password_hash: string;
  name: string;
  adress: string;
  _id?: string;
  phone_number: string;
  created_at?: Date;
  products?: []; //editar e colocar products aqui;
  role: string;
  purchasedProducts?: []; //editar e colocar products aqui
  profile_picture: string | null;
}

export class User {
  private props: UserSchema;

  constructor(props: UserSchema) {
    this.props = {
      ...props,
      created_at: props.created_at || new Date(),
      role: props.role || 'USER',
      profile_picture: props.profile_picture || null,
    };
  }

  get _id(): string {
    return this.props._id;
  }

  get products(): [] {
    return this.props.products;
  }
  get purchasedProducts(): [] {
    return this.props.purchasedProducts;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password_hash(): string {
    return this.props.password_hash;
  }

  set password_hash(password: string) {
    this.props.password_hash = password;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }
  get adress(): string {
    return this.props.name;
  }

  set adress(adress: string) {
    this.props.adress = adress;
  }
  get phone_number(): string {
    return this.props.phone_number;
  }

  set phone_number(phone_number: string) {
    this.props.phone_number = phone_number;
  }

  get profile_picture(): string {
    return this.props.profile_picture;
  }
  set role(role: string) {
    this.props.phone_number = role;
  }

  get role(): string {
    return this.props.role;
  }

  set profile_picture(profile_picture: string) {
    this.props.profile_picture = profile_picture;
  }
  get avatar(): string {
    return this.props.profile_picture;
  }

  set avatar(profile_picture: string) {
    this.props.profile_picture = profile_picture;
  }

  get created_at(): Date {
    return this.props.created_at;
  }
}
