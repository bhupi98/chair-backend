import { IsBoolean, IsNumber,IsNotEmpty, Min,IsObject, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class UpdateBidDTO {
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsNotEmpty({ message: 'Time estimate is required' })
  @IsString({ message: 'Time estimate must be a string' })
  timeEstimate: string;
}
export class TitleDescription {
  @IsString()
  text: string;
}
class Coordinates {
  @IsNumber()
  lat: number;

  @IsNumber()
  lon: number;
}

class Location {
  @IsString()
  city: string;

  @ValidateNested()
  @Type(() => Coordinates)
  coords: Coordinates;
}

class BidDTO {
  @IsString()
  repairmanId: string;

  @IsNumber()
  amount: number;

  @IsString()
  timeEstimate: string;

  @IsString()
  bidAt: string; // Must be string to match response DTO
}

export class OrderDTO {
  
  @ValidateNested()
  @Type(() => TitleDescription)
  title: TitleDescription;

  @ValidateNested()
  @Type(() => TitleDescription)
  description: TitleDescription;

  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @IsNumber()
  budget: number;

  @IsString()
  status: string;

  @IsString()
  postedAt: string = new Date().toISOString();

  @IsString()
  category: string;

  @IsString()
  customerId: string;

  @IsBoolean()
  allowBidding: boolean;
  @IsBoolean()
  isEnable: boolean;
  
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateOrderDTO {
  @ValidateNested()
  @IsOptional()
  @Type(() => TitleDescription)
  title?: TitleDescription;

  @ValidateNested()
  @IsOptional()
  @Type(() => TitleDescription)
  description?: TitleDescription;

  @ValidateNested()
  @IsOptional()
  @Type(() => Location)
  location?: Location;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsString()
  @IsOptional()
  acceptedBidRepairmanId?: string;
}

export class OrderResponseDTO {
  id: string;
  customerId: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  budget: number;
  location: { city: string };
  status: string;
  createdAt: Date;
  updatedAt: Date;
  images: string[];
  bids: {
    repairmanId: string;
    amount: number;
    timeEstimate: string;
    bidAt: string;
    id: string; // Add this to match _id from the schema
  }[];
  acceptedBidRepairmanId?: string | null;
  allowBidding: boolean;
}