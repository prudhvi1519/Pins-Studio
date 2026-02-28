import { PartialType } from '@nestjs/mapped-types';
import { CreatePinDto } from './create-pin.dto';

export class UpdatePinDto extends PartialType(CreatePinDto) { }
