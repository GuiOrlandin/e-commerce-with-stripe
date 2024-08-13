export interface ProductSchema {
  _id?: string;
  created_at: Date;
  name: string;
  description?: string;
  image_url: string;
  unit_value: number;
  stock: number;
  user_id: string;
  category: string;
}

export class Product {
  private props: ProductSchema;

  constructor(props: ProductSchema) {
    this.props = {
      ...props,
      created_at: props.created_at || new Date(),
      image_url: props.image_url || null,
    };
  }

  get _id(): string {
    return this.props._id;
  }

  get name(): string {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get user_id(): string {
    return this.props.user_id;
  }

  set user_id(user_id: string) {
    this.props.user_id = user_id;
  }
  get category(): string {
    return this.props.category;
  }

  set category(category: string) {
    this.props.category = category;
  }

  get stock(): number {
    return this.props.stock;
  }

  set stock(stock: number) {
    this.props.stock = stock;
  }
  get description(): string {
    return this.props.description;
  }

  set description(description: string) {
    this.props.name = description;
  }
  get unit_value(): number {
    return this.props.unit_value;
  }

  set unit_value(unit_value: string) {
    this.props.name = unit_value;
  }

  get image_url(): string {
    return this.props.image_url;
  }

  set image_url(image_url: string) {
    this.props.image_url = image_url;
  }

  get created_at(): Date {
    return this.props.created_at;
  }
}
