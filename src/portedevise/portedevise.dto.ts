import { ApiProperty } from '@nestjs/swagger';

export class PtDv {
    @ApiProperty()
    readonly porteId: number;

    @ApiProperty()
    readonly deviseId: number;

}