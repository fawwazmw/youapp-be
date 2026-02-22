import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional() @IsString() displayName?: string;

  @ApiProperty({ required: false, example: 'Male' })
  @IsOptional() @IsString() gender?: string;

  @ApiProperty({ required: false, example: '1990-01-15' })
  @IsOptional() @IsDateString() birthday?: string;

  @ApiProperty({ required: false, example: 175 })
  @IsOptional() @IsNumber() height?: number;

  @ApiProperty({ required: false, example: 70 })
  @IsOptional() @IsNumber() weight?: number;

  @ApiProperty({ required: false, type: [String], example: ['Coding', 'Reading'] })
  @IsOptional() @IsArray() @IsString({ each: true }) interests?: string[];
}

export class UpdateProfileDto extends CreateProfileDto {}
