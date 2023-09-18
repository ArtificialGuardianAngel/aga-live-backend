import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Belt {
  white = "white",
  yellow = "yellow",
  orange = "orange",
  green = "green",
  blue = "blue",
  purple = "purple",
  red = "red",
  brown = "brown",
  black = "black",
}

@Schema()
export class DeveloperModel {
  @Prop()
  name: string;
  @Prop()
  slug: string;
  @Prop()
  email: string;
  @Prop()
  github: string;

  @Prop({ enum: Belt })
  belt: Belt;
}

export const developerModelSchema =
  SchemaFactory.createForClass(DeveloperModel);
