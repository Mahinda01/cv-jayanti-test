<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Hydraulic Hose',
                'slug' => 'hydraulic-hose',
            ],
            [
                'name' => 'Fittings',
                'slug' => 'fittings',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
            ],
            [
                'name' => 'Hydraulic Adapters',
                'slug' => 'hydraulic-adapters',
            ],
        ];

        foreach ($categories as $category) {
            ProductCategory::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'is_active' => true,
                ],
            );
        }
    }
}