<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => 'P' . str_pad(
                        $product->id,
                        3,
                        '0',
                        STR_PAD_LEFT
                    ),
                    'product_category_id' =>
                        $product->product_category_id,
                    'name' => $product->name,
                    'category' => $product->category?->name ?? '-',
                    'category_slug' => $product->category?->slug,
                    'stock' => $product->stock,
                    'minimum_stock' => $product->minimum_stock,
                    'unit' => $product->unit,
                    'location' => $product->location,
                    'purchase_price' => $product->purchase_price,
                    'price' => $product->price,
                    'is_active' => (bool) $product->is_active,
                ];
            });

        return Inertia::render($this->view('Products/Index'), [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render($this->view('Products/Create'), [
            'categories' => $this->getCategories(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_category_id' => [
                'required',
            ],
            'new_category_name' => [
                'nullable',
                'string',
                'max:100',
            ],
            'new_category_default_unit' => [
                'nullable',
                Rule::in(['Pcs', 'Meter', 'Unit', 'Set']),
            ],
            'name' => [
                'required',
                'string',
                'max:150',
            ],
            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],
            'stock' => [
                'required',
                'integer',
                'min:0',
            ],
            'minimum_stock' => [
                'required',
                'integer',
                'min:0',
            ],
            'unit' => [
                'required',
                Rule::in(['Pcs', 'Meter', 'Unit', 'Set']),
            ],
            'location' => [
                'required',
                Rule::in([
                    'Gudang Dalam',
                    'Gudang Samping',
                    'Jolly Box Merah',
                    'Jolly Box Biru',
                    'Jolly Box Kuning',
                    'Jolly Box Hijau',
                ]),
            ],
            'purchase_price' => [
                'required',
                'numeric',
                'min:0',
            ],
            'price' => [
                'required',
                'numeric',
                'min:1',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);

        if (
            (int) $validated['stock'] > 0 &&
            (float) $validated['purchase_price'] <= 0
        ) {
            throw ValidationException::withMessages([
                'purchase_price' =>
                    'Harga modal awal wajib lebih dari 0 ketika stok awal tersedia.',
            ]);
        }

        DB::transaction(function () use ($validated) {
            $category = $this->resolveCategory(
                $validated,
                true
            );

            $unit = $category->slug === 'other'
                ? $validated['unit']
                : $category->default_unit;

            $imagePath = null;

            if (! empty($validated['image'])) {
                $imagePath = $validated['image']->store(
                    'products',
                    'public'
                );
            }

            Product::create([
                'product_category_id' => $category->id,
                'name' => $validated['name'],
                'slug' => $this->generateProductSlug(
                    $validated['name']
                ),
                'description' => $validated['description'] ?? null,
                'stock' => (int) $validated['stock'],
                'minimum_stock' =>
                    (int) $validated['minimum_stock'],
                'unit' => $unit,
                'location' => $validated['location'],
                'purchase_price' =>
                    (float) $validated['purchase_price'],
                'price' => (float) $validated['price'],
                'image' => $imagePath,
                'is_active' => true,
            ]);
        });

        return redirect()
            ->route($this->routeName('products.index'))
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return Inertia::render($this->view('Products/Edit'), [
            'product' => [
                'id' => $product->id,
                'code' => 'P' . str_pad(
                    $product->id,
                    3,
                    '0',
                    STR_PAD_LEFT
                ),
                'product_category_id' =>
                    $product->product_category_id,
                'name' => $product->name,
                'description' => $product->description,
                'stock' => $product->stock,
                'minimum_stock' => $product->minimum_stock,
                'unit' => $product->unit,
                'location' => $product->location,
                'purchase_price' => $product->purchase_price,
                'price' => $product->price,
                'image' => $product->image,
                'image_url' => $product->image
                    ? Storage::url($product->image)
                    : null,
                'is_active' => (bool) $product->is_active,
            ],
            'categories' => $this->getCategories(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'product_category_id' => [
                'required',
                'integer',
                Rule::exists('product_categories', 'id')
                    ->where(function ($query) {
                        $query->where('is_active', true);
                    }),
            ],
            'name' => [
                'required',
                'string',
                'max:150',
            ],
            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],
            'minimum_stock' => [
                'required',
                'integer',
                'min:0',
            ],
            'unit' => [
                'required',
                Rule::in(['Pcs', 'Meter', 'Unit', 'Set']),
            ],
            'location' => [
                'required',
                Rule::in([
                    'Gudang Dalam',
                    'Gudang Samping',
                    'Jolly Box Merah',
                    'Jolly Box Biru',
                    'Jolly Box Kuning',
                    'Jolly Box Hijau',
                ]),
            ],
            'price' => [
                'required',
                'numeric',
                'min:1',
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ]);

        DB::transaction(function () use (
            $product,
            $validated
        ) {
            $category = ProductCategory::whereKey(
                $validated['product_category_id']
            )
                ->where('is_active', true)
                ->first();

            if (! $category) {
                throw ValidationException::withMessages([
                    'product_category_id' =>
                        'Kategori tidak valid atau sudah tidak aktif.',
                ]);
            }

            $unit = $category->slug === 'other'
                ? $validated['unit']
                : $category->default_unit;

            $updateData = [
                'product_category_id' => $category->id,
                'name' => $validated['name'],
                'slug' => $this->generateProductSlug(
                    $validated['name'],
                    $product->id
                ),
                'description' => $validated['description'] ?? null,
                'minimum_stock' =>
                    (int) $validated['minimum_stock'],
                'unit' => $unit,
                'location' => $validated['location'],
                'price' => (float) $validated['price'],
            ];

            $oldImage = $product->image;

            if (! empty($validated['image'])) {
                $updateData['image'] =
                    $validated['image']->store(
                        'products',
                        'public'
                    );
            }

            $product->update($updateData);

            if (
                ! empty($updateData['image']) &&
                $oldImage
            ) {
                Storage::disk('public')->delete($oldImage);
            }
        });

        return redirect()
            ->route($this->routeName('products.index'))
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function toggleStatus($id)
    {
        $product = Product::findOrFail($id);

        $product->update([
            'is_active' => ! $product->is_active,
        ]);

        $message = $product->is_active
            ? 'Produk berhasil diaktifkan.'
            : 'Produk berhasil dinonaktifkan.';

        return redirect()
            ->route($this->routeName('products.index'))
            ->with('success', $message);
    }

    private function resolveCategory(
        array $validated,
        bool $allowCreate
    ): ProductCategory {
        if (
            $allowCreate &&
            $validated['product_category_id'] === '__new__'
        ) {
            $categoryName = trim(
                $validated['new_category_name'] ?? ''
            );

            $defaultUnit =
                $validated['new_category_default_unit']
                ?? null;

            if ($categoryName === '') {
                throw ValidationException::withMessages([
                    'new_category_name' =>
                        'Nama kategori baru wajib diisi.',
                ]);
            }

            if (! in_array(
                $defaultUnit,
                ['Pcs', 'Meter', 'Unit', 'Set'],
                true
            )) {
                throw ValidationException::withMessages([
                    'new_category_default_unit' =>
                        'Satuan kategori baru tidak valid.',
                ]);
            }

            $slug = Str::slug($categoryName);

            if (
                ProductCategory::where('slug', $slug)->exists()
            ) {
                throw ValidationException::withMessages([
                    'new_category_name' =>
                        'Kategori tersebut sudah tersedia.',
                ]);
            }

            return ProductCategory::create([
                'name' => $categoryName,
                'slug' => $slug,
                'default_unit' => $defaultUnit,
                'is_active' => true,
            ]);
        }

        $category = ProductCategory::whereKey(
            $validated['product_category_id']
        )
            ->where('is_active', true)
            ->first();

        if (! $category) {
            throw ValidationException::withMessages([
                'product_category_id' =>
                    'Kategori tidak valid atau sudah tidak aktif.',
            ]);
        }

        return $category;
    }

    private function getCategories()
    {
        return ProductCategory::where('is_active', true)
            ->orderBy('id')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'default_unit' =>
                        $category->default_unit,
                ];
            });
    }

    private function generateProductSlug(
        string $name,
        ?int $ignoreId = null
    ): string {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $number = 1;

        while (
            Product::where('slug', $slug)
                ->when(
                    $ignoreId,
                    function ($query) use ($ignoreId) {
                        $query->where('id', '!=', $ignoreId);
                    }
                )
                ->exists()
        ) {
            $slug = $baseSlug . '-' . $number;
            $number++;
        }

        return $slug;
    }

    private function view(string $page): string
    {
        return request()->routeIs('staff.*')
            ? 'Staff/' . $page
            : 'Admin/' . $page;
    }

    private function routeName(string $name): string
    {
        return request()->routeIs('staff.*')
            ? 'staff.' . $name
            : 'admin.' . $name;
    }
}