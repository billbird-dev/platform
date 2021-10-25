import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { RequestWithCompany } from 'src/auth/auth.interfaces';
import JwtAuthenticationGuard from 'src/auth/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { InventoryService } from './product.service';

@Controller('inventory')
@UseGuards(JwtAuthenticationGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @HttpCode(201)
  create(@Req() req: RequestWithCompany, @Body() productData: CreateProductDto) {
    return this.inventoryService.createProduct(productData, req.user.id);
  }

  @Get()
  findAll(@Req() req: RequestWithCompany) {
    return this.inventoryService.getInventory(req.user.id);
  }

  @Get(':id')
  findOne(@Req() req: RequestWithCompany, @Param('id') id: string) {
    return this.inventoryService.getProductById(req.user.id, +id);
  }

  @Get('parent')
  findAsChild(@Req() req: RequestWithCompany) {
    return this.inventoryService.getParentInventory(req.user.parent);
  }

  @Get('child/:id')
  findAsParent(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.inventoryService.getChildInventory(req.user.id, +id);
  }

  @Patch(':id')
  update(
    @Req() req: RequestWithCompany,
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ) {
    return this.inventoryService.updateProductById(req.user.id, +id, productData);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Req() req: RequestWithCompany, @Param('id') id: number) {
    return this.inventoryService.deleteProductById(req.user.id, +id);
  }
}
