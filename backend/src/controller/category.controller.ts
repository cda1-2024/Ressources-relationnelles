import { Body, Controller, Delete, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('api/category/')
export class CommentController {
  @Post('/')
  createCategory(): null {
    return null;
  }

  @Put('/:idCategory')
  UpdateCategory(): null {
    return null;
  }

  @Delete('/:idCategory')
  deleteCategory(): null {
    return null;
  }
}
