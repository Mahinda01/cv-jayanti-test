<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'code' => 'P' . str_pad($product->id, 3, '0', STR_PAD_LEFT),
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->category?->name,
                    'supplier' => $product->supplier,
                    'description' => $product->description,
                    'stock' => $product->stock,
                    'minimum_stock' => $product->minimum_stock,
                    'unit' => $product->unit,
                    'location' => $product->location,
                    'purchase_price' => $product->purchase_price,
                    'price' => $product->price,
                    'is_active' => $product->is_active,
                    'created_at' => $product->created_at->format('d M Y'),
                ];
            });

        return Inertia::render($this->view('Products/Index'), [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'default_unit' => $category->default_unit ?: 'Pcs',
                ];
            });

        return Inertia::render($this->view('Products/Create'), [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_category_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value === '__new__') {
                        return;
                    }

                    $exists = ProductCategory::where('id', $value)
                        ->where('is_active', true)
                        ->exists();

                    if (! $exists) {
                        $fail('Kategori yang dipilih tidak valid.');
                    }
                },
            ],
            'new_category_name' => [
                'nullable',
                'string',
                'max:100',
                Rule::requiredIf($request->input('product_category_id') === '__new__'),
            ],
            'new_category_default_unit' => [
                'nullable',
                'string',
                Rule::in(['Pcs', 'Meter', 'Unit', 'Set']),
                Rule::requiredIf($request->input('product_category_id') === '__new__'),
            ],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('products', 'name'),
            ],
            'description' => ['nullable', 'string'],
            'supplier' => ['nullable', 'string', 'max:150'],
            'stock' => ['required', 'integer', 'min:0'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'location' => ['nullable', 'string', 'max:150'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['required', 'boolean'],
        ]);

        $category = $this->getCategory($request);
        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        Product::create([
            'product_category_id' => $category->id,
            'name' => $validated['name'],
            'slug' => $this->makeUniqueSlug($validated['name']),
            'description' => $validated['description'] ?? null,
            'supplier' => $validated['supplier'] ?? null,
            'stock' => $validated['stock'],
            'minimum_stock' => $validated['minimum_stock'],
            'unit' => $category->default_unit ?: 'Pcs',
            'location' => $validated['location'] ?? null,
            'purchase_price' => $validated['purchase_price'],
            'price' => $validated['price'],
            'image' => $imagePath,
            'is_active' => $validated['is_active'],
        ]);

        return redirect()
            ->route($this->routeName('products.index'))
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $product = Product::findOrFail($id);

        $categories = ProductCategory::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'default_unit' => $category->default_unit ?: 'Pcs',
                ];
            });

        return Inertia::render($this->view('Products/Edit'), [
            'product' => [
                'id' => $product->id,
                'code' => 'P' . str_pad($product->id, 3, '0', STR_PAD_LEFT),
                'product_category_id' => $product->product_category_id,
                'name' => $product->name,
                'description' => $product->description,
                'supplier' => $product->supplier,
                'stock' => $product->stock,
                'minimum_stock' => $product->minimum_stock,
                'unit' => $product->unit,
                'location' => $product->location,
                'purchase_price' => $product->purchase_price,
                'price' => $product->price,
                'image' => $product->image,
                'image_url' => $this->imageUrl($product->image),
                'is_active' => $product->is_active,
            ],
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'product_category_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    if ($value === '__new__') {
                        return;
                    }

                    $exists = ProductCategory::where('id', $value)
                        ->where('is_active', true)
                        ->exists();

                    if (! $exists) {
                        $fail('Kategori yang dipilih tidak valid.');
                    }
                },
            ],
            'new_category_name' => [
                'nullable',
                'string',
                'max:100',
                Rule::requiredIf($request->input('product_category_id') === '__new__'),
            ],
            'new_category_default_unit' => [
                'nullable',
                'string',
                Rule::in(['Pcs', 'Meter', 'Unit', 'Set']),
                Rule::requiredIf($request->input('product_category_id') === '__new__'),
            ],
            'name' => [
                'required',
                'string',
                'max:150',
                Rule::unique('products', 'name')->ignore($product->id),
            ],
            'description' => ['nullable', 'string'],
            'supplier' => ['nullable', 'string', 'max:150'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'location' => ['nullable', 'string', 'max:150'],
            'purchase_price' => ['required', 'numeric', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['required', 'boolean'],
        ]);

        $category = $this->getCategory($request);
        $imagePath = $product->image;

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'product_category_id' => $category->id,
            'name' => $validated['name'],
            'slug' => $this->makeUniqueSlug($validated['name'], $product->id),
            'description' => $validated['description'] ?? null,
            'supplier' => $validated['supplier'] ?? null,
            'minimum_stock' => $validated['minimum_stock'],
            'unit' => $category->default_unit ?: 'Pcs',
            'location' => $validated['location'] ?? null,
            'purchase_price' => $validated['purchase_price'],
            'price' => $validated['price'],
            'image' => $imagePath,
            'is_active' => $validated['is_active'],
        ]);

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

        return redirect()
            ->route($this->routeName('products.index'))
            ->with('success', 'Status produk berhasil diperbarui.');
    }

    private function getCategory(Request $request)
    {
        if ($request->input('product_category_id') !== '__new__') {
            return ProductCategory::findOrFail($request->input('product_category_id'));
        }

        $categoryName = trim($request->input('new_category_name'));
        $defaultUnit = $request->input('new_category_default_unit') ?: 'Pcs';

        $existingCategory = ProductCategory::whereRaw('LOWER(name) = ?', [
            strtolower($categoryName),
        ])->first();

        if ($existingCategory) {
            $existingCategory->is_active = true;
            $existingCategory->default_unit = $defaultUnit;
            $existingCategory->save();

            return $existingCategory;
        }

        $category = new ProductCategory();
        $category->name = $categoryName;
        $category->default_unit = $defaultUnit;
        $category->is_active = true;
        $category->save();

        return $category;
    }

    private function makeUniqueSlug($name, $ignoreId = null)
    {
        $slug = Str::slug($name);

        if ($slug === '') {
            $slug = 'produk';
        }

        $originalSlug = $slug;
        $number = 1;

        while (
            Product::where('slug', $slug)
                ->when($ignoreId, function ($query) use ($ignoreId) {
                    $query->where('id', '!=', $ignoreId);
                })
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $number;
            $number++;
        }

        return $slug;
    }

    private function imageUrl($image)
    {
        if (! $image) {
            return null;
        }

        if (Str::startsWith($image, ['http://', 'https://', '/'])) {
            return $image;
        }

        return Storage::url($image);
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