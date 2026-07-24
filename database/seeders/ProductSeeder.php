<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        Product::truncate();

        ProductCategory::where('name', 'Accessories')->delete();
        ProductCategory::where('slug', 'accessories')->delete();

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $fittingsCategory = ProductCategory::updateOrCreate(
            ['slug' => 'fittings'],
            [
                'name' => 'Fittings',
                'is_active' => true,
            ]
        );

        $bushingCategory = ProductCategory::updateOrCreate(
            ['slug' => 'bushing'],
            [
                'name' => 'Bushing',
                'is_active' => true,
            ]
        );

        $products = [
            [
                'category_id' => $fittingsCategory->id,
                'name' => '04-12 BJM 90',
                'price' => 35000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/04-12 BJM 90.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '06-06 HTC 90Long',
                'price' => 35000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/06-06 HTC 90Long.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '06-14 BJM',
                'price' => 35000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/06-14 BJM.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '08-20 MJL',
                'price' => 40000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/08-20 MJL.jpg',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '12-12 DT',
                'price' => 40000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/12-12 DT.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '12-12 HTC 90',
                'price' => 40000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/12-12 HTC 90.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '12-12 HTC',
                'price' => 40000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/12-12 HTC.jpg',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '12-12 PA 45Long',
                'price' => 35000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/12-12 PA 45Long.jpg',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '12-12 PA 90Long',
                'price' => 35000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/12-12 PA 90Long.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '12-12 PA',
                'price' => 35000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/12-12 PA.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '16-16 NJ',
                'price' => 45000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/16-16 NJ.jpg',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '16-16 PH 45Long',
                'price' => 45000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/16-16 PH 45Long.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '16-16 PHC 90Long',
                'price' => 45000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/16-16 PHC 90Long.png',
            ],
            [
                'category_id' => $fittingsCategory->id,
                'name' => '20-20 PH',
                'price' => 50000,
                'stock' => 20,
                'minimum_stock' => 5,
                'image' => '/images/products/20-20 PH.png',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 04R1',
                'price' => 18000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 04R1.png',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 04R2',
                'price' => 18000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 04R2.png',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 08R1',
                'price' => 20000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 08R1.jpg',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 08R4',
                'price' => 20000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 08R4.jpg',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 10R2',
                'price' => 22000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 10R2.png',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 10R4',
                'price' => 22000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 10R4.jpg',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 12R2',
                'price' => 25000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 12R2.jpg',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 12R4',
                'price' => 25000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 12R4.jpg',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 16R2',
                'price' => 30000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 16R2.jpg',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 16R4',
                'price' => 30000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 16R4.jpg',
            ],
            [
                'category_id' => $bushingCategory->id,
                'name' => 'BOSS 20R4',
                'price' => 35000,
                'stock' => 50,
                'minimum_stock' => 10,
                'image' => '/images/products/BOSS 20R4.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::create([
                'product_category_id' => $product['category_id'],
                'name' => $product['name'],
                'slug' => Str::slug($product['name']),
                'description' => $product['name'] . ' untuk kebutuhan sambungan sistem hidrolik.',
                'supplier' => null,
                'price' => $product['price'],
                'stock' => $product['stock'],
                'minimum_stock' => $product['minimum_stock'],
                'unit' => 'Pcs',
                'location' => 'Gudang Dalam',
                'purchase_price' => 0,
                'image' => $product['image'],
                'is_active' => true,
            ]);
        }
    }
}