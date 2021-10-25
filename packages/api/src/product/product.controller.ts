import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryService } from './product.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // @Post()
  // create(@Body() createInventoryDto: any) {
  //   return this.inventoryService.create(createInventoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.inventoryService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.inventoryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateInventoryDto: any) {
  //   return this.inventoryService.update(+id, updateInventoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.inventoryService.remove(+id);
  // }
}
