<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $this->renameCategory(
                'accessories',
                'bushing',
                'Bushing',
                'Pcs'
            );

            $this->renameCategory(
                'hydraulic-adapters',
                'other',
                'Other',
                'Pcs'
            );

            $categories = [
                [
                    'name' => 'Hydraulic Hose',
                    'slug' => 'hydraulic-hose',
                    'default_unit' => 'Meter',
                ],
                [
                    'name' => 'Fittings',
                    'slug' => 'fittings',
                    'default_unit' => 'Pcs',
                ],
                [
                    'name' => 'Bushing',
                    'slug' => 'bushing',
                    'default_unit' => 'Pcs',
                ],
                [
                    'name' => 'Other',
                    'slug' => 'other',
                    'default_unit' => 'Pcs',
                ],
            ];

            foreach ($categories as $category) {
                ProductCategory::updateOrCreate(
                    [
                        'slug' => $category['slug'],
                    ],
                    [
                        'name' => $category['name'],
                        'default_unit' => $category['default_unit'],
                        'is_active' => true,
                    ],
                );
            }
        });
    }

    private function renameCategory(
        string $oldSlug,
        string $newSlug,
        string $newName,
        string $defaultUnit
    ): void {
        $oldCategory = ProductCategory::where(
            'slug',
            $oldSlug
        )->first();

        $newCategory = ProductCategory::where(
            'slug',
            $newSlug
        )->first();

        if (
            $oldCategory &&
            $newCategory &&
            $oldCategory->id !== $newCategory->id
        ) {
            Product::where(
                'product_category_id',
                $oldCategory->id
            )->update([
                'product_category_id' => $newCategory->id,
            ]);

            $oldCategory->delete();

            return;
        }

        if ($oldCategory && ! $newCategory) {
            $oldCategory->update([
                'name' => $newName,
                'slug' => $newSlug,
                'default_unit' => $defaultUnit,
                'is_active' => true,
            ]);
        }
    }
}