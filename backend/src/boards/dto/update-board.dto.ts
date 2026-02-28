import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardDto } from './create-board.dto';
import { OmitType } from '@nestjs/mapped-types';

// UpdateBoardDto typically only updates the name, we shouldn't allow changing the userId owner
export class UpdateBoardDto extends PartialType(OmitType(CreateBoardDto, ['userId'] as const)) { }
