import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { calculateZodiac, calculateHoroscope } from '../common/utils/zodiac.util';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(Profile.name) private profileModel: Model<ProfileDocument>) {}

  async createProfile(userId: string, createProfileDto: CreateProfileDto): Promise<Profile> {
    const existingProfile = await this.profileModel.findOne({ userId });
    if (existingProfile) {
      throw new ConflictException('Profile already exists');
    }

    let zodiac, horoscope;
    if (createProfileDto.birthday) {
      const birthDate = new Date(createProfileDto.birthday);
      zodiac = calculateZodiac(birthDate);
      horoscope = calculateHoroscope(birthDate);
    }

    const newProfile = new this.profileModel({
      userId,
      ...createProfileDto,
      zodiac,
      horoscope,
    });

    return newProfile.save();
  }

  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    let updates = { ...updateProfileDto } as any;

    if (updateProfileDto.birthday) {
      const birthDate = new Date(updateProfileDto.birthday);
      updates.zodiac = calculateZodiac(birthDate);
      updates.horoscope = calculateHoroscope(birthDate);
    }

    const updatedProfile = await this.profileModel.findOneAndUpdate({ userId }, updates, { new: true });
    if (!updatedProfile) {
      throw new NotFoundException('Profile not found');
    }
    return updatedProfile;
  }
}
