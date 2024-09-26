import { Product } from 'src/modules/products/entities/product';
import { CheckoutItems, DataItems } from '../repositories/userRepository';

export interface UserSchema {
  email: string;
  password_hash: string;
  name: string;
  adress?: string;
  id?: string;
  phone_number?: string;
  created_at?: Date;
  products?: Product[];
  role?: string;
  purchasedProducts?: CheckoutItems[];
  soldProducts?: DataItems[];
  profile_picture?: string | null;
  number?: string;
}

export class User {
  private props: UserSchema;

  constructor(props: UserSchema) {
    this.props = {
      ...props,
      created_at: props.created_at || new Date(),
      role: props.role || 'USER',
      purchasedProducts: props.purchasedProducts || [],
      soldProducts: props.soldProducts || [],
      products: props.products || [],
      adress: props.adress || '',
      profile_picture: props.profile_picture || null,
    };
  }

  get id(): string {
    return this.props.id;
  }

  get products(): Product[] {
    return this.props.products;
  }

  get purchasedProducts(): CheckoutItems[] {
    return this.props.purchasedProducts;
  }
  get soldProducts(): DataItems[] {
    return this.props.soldProducts;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }
  get number(): string {
    return this.props.number;
  }

  set number(number: string) {
    this.props.number = number;
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

  toResponseObject(): Omit<UserSchema, 'password_hash'> {
    const { password_hash, ...userWithoutPassword } = this.props;
    return userWithoutPassword;
  }
}
