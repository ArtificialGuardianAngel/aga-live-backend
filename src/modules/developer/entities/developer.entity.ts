import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum Belt {
  white,
  yellow,
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
