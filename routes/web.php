<?php

use App\Http\Controllers\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\PurchaseController as AdminPurchaseController;
use App\Http\Controllers\Admin\ReceivableController as AdminReceivableController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Admin\SaleController as AdminSaleController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Staff\CustomerController as StaffCustomerController;
use App\Http\Controllers\Staff\DashboardController as StaffDashboardController;
use App\Http\Controllers\Staff\ProductController as StaffProductController;
use App\Http\Controllers\Staff\PurchaseController as StaffPurchaseController;
use App\Http\Controllers\Staff\SaleController as StaffSaleController;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Halaman Publik
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    $products = Product::with('category')
        ->where('is_active', true)
        ->orderBy('id')
        ->take(4)
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category?->name,
                'description' => $product->description,
                'price' => 'Rp ' . number_format(
                    $product->price,
                    0,
                    ',',
                    '.'
                ),
                'stock' => $product->stock,
                'availability_status' => $product->stock > 0
                    ? 'Tersedia'
                    : 'Tidak Tersedia',
                'image' => $product->image,
                'image_url' => $product->image
                    ? '/storage/' . ltrim($product->image, '/')
                    : null,
                'is_active' => (bool) $product->is_active,
            ];
        });

    return Inertia::render('Public/Home', [
        'products' => $products,
    ]);
})->name('home');

Route::get('/produk', function () {
    $categories = ProductCategory::where('is_active', true)
        ->orderBy('id')
        ->pluck('name')
        ->prepend('Semua')
        ->values();

    $products = Product::with('category')
        ->where('is_active', true)
        ->orderBy('id')
        ->get()
        ->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category' => $product->category?->name,
                'description' => $product->description,
                'price' => 'Rp ' . number_format(
                    $product->price,
                    0,
                    ',',
                    '.'
                ),
                'stock' => $product->stock,
                'availability_status' => $product->stock > 0
                    ? 'Tersedia'
                    : 'Tidak Tersedia',
                'image' => $product->image,
                'image_url' => $product->image
                    ? '/storage/' . ltrim($product->image, '/')
                    : null,
                'is_active' => (bool) $product->is_active,
            ];
        });

    return Inertia::render('Public/ProductList', [
        'categories' => $categories,
        'products' => $products,
    ]);
})->name('public.products.index');

Route::get('/produk/{slug}', function ($slug) {
    $product = Product::with('category')
        ->where('slug', $slug)
        ->where('is_active', true)
        ->firstOrFail();

    $nextRelatedProducts = Product::with('category')
        ->where(
            'product_category_id',
            $product->product_category_id
        )
        ->where('is_active', true)
        ->where('id', '>', $product->id)
        ->orderBy('id')
        ->take(3)
        ->get();

    if ($nextRelatedProducts->count() < 3) {
        $previousRelatedProducts = Product::with('category')
            ->where(
                'product_category_id',
                $product->product_category_id
            )
            ->where('is_active', true)
            ->where('id', '<', $product->id)
            ->orderBy('id')
            ->take(3 - $nextRelatedProducts->count())
            ->get();

        $nextRelatedProducts = $nextRelatedProducts->concat(
            $previousRelatedProducts
        );
    }

    $relatedProducts = $nextRelatedProducts
        ->take(3)
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'category' => $item->category?->name,
                'description' => $item->description,
                'price' => 'Rp ' . number_format(
                    $item->price,
                    0,
                    ',',
                    '.'
                ),
                'stock' => $item->stock,
                'availability_status' => $item->stock > 0
                    ? 'Tersedia'
                    : 'Tidak Tersedia',
                'image' => $item->image,
                'image_url' => $item->image
                    ? '/storage/' . ltrim($item->image, '/')
                    : null,
                'is_active' => (bool) $item->is_active,
            ];
        });

    return Inertia::render('Public/ProductDetail', [
        'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'category' => $product->category?->name,
            'description' => $product->description,
            'price' => 'Rp ' . number_format(
                $product->price,
                0,
                ',',
                '.'
            ),
            'stock' => $product->stock,
            'availability_status' => $product->stock > 0
                ? 'Tersedia'
                : 'Tidak Tersedia',
            'image' => $product->image,
            'image_url' => $product->image
                ? '/storage/' . ltrim($product->image, '/')
                : null,
            'is_active' => (bool) $product->is_active,
        ],
        'relatedProducts' => $relatedProducts,
    ]);
})->name('public.products.show');

/*
|--------------------------------------------------------------------------
| Halaman Login
|--------------------------------------------------------------------------
*/

Route::get('/login', function () {
    return redirect()->route('login.admin');
})->name('login');

Route::get('/login/admin', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Auth/AdminLogin');
})->name('login.admin');

Route::get('/login/staff', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Auth/StaffLogin');
})->name('login.staff');

/*
|--------------------------------------------------------------------------
| Pengarah Dashboard Berdasarkan Role
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    $user = Auth::user();

    if ($user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    if ($user->role === 'staff') {
        return redirect()->route('staff.dashboard');
    }

    Auth::logout();

    return redirect()->route('login.admin');
})
    ->middleware(['auth', 'active'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Halaman Admin
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'active', 'role:admin'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Dashboard Admin
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/dashboard',
        [AdminDashboardController::class, 'index']
    )->name('admin.dashboard');

    /*
    |--------------------------------------------------------------------------
    | Transaksi Pembelian
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/pembelian',
        [AdminPurchaseController::class, 'index']
    )->name('admin.purchases.index');

    Route::get(
        '/admin/pembelian/tambah',
        [AdminPurchaseController::class, 'create']
    )->name('admin.purchases.create');

    Route::post(
        '/admin/pembelian',
        [AdminPurchaseController::class, 'store']
    )->name('admin.purchases.store');

    Route::patch(
        '/admin/pembelian/{id}/batalkan',
        [AdminPurchaseController::class, 'cancel']
    )->name('admin.purchases.cancel');

    /*
    |--------------------------------------------------------------------------
    | Transaksi Penjualan
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/transaksi',
        [AdminSaleController::class, 'index']
    )->name('admin.sales.index');

    Route::get(
        '/admin/transaksi/tambah',
        [AdminSaleController::class, 'create']
    )->name('admin.sales.create');

    Route::post(
        '/admin/transaksi',
        [AdminSaleController::class, 'store']
    )->name('admin.sales.store');

    Route::get(
        '/admin/transaksi/{id}/bon',
        [AdminSaleController::class, 'bon']
    )->name('admin.sales.bon');

    Route::patch(
        '/admin/transaksi/{id}/batalkan',
        [AdminSaleController::class, 'cancel']
    )->name('admin.sales.cancel');

    /*
    |--------------------------------------------------------------------------
    | Piutang Pelanggan
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/piutang',
        [AdminReceivableController::class, 'index']
    )->name('admin.receivables.index');

    Route::get(
        '/admin/piutang/awal/tambah',
        [AdminReceivableController::class, 'createInitial']
    )->name('admin.receivables.initial.create');

    Route::post(
        '/admin/piutang/awal',
        [AdminReceivableController::class, 'storeInitial']
    )->name('admin.receivables.initial.store');

    Route::get(
        '/admin/piutang/penjualan/{sale}',
        [AdminReceivableController::class, 'showSale']
    )->name('admin.receivables.sale.show');

    Route::get(
        '/admin/piutang/awal/{initialReceivable}',
        [AdminReceivableController::class, 'showInitial']
    )->name('admin.receivables.initial.show');

    Route::post(
        '/admin/piutang/pembayaran',
        [AdminReceivableController::class, 'storePayment']
    )->name('admin.receivables.payments.store');

    Route::patch(
        '/admin/piutang/pembayaran/{payment}/batalkan',
        [AdminReceivableController::class, 'cancelPayment']
    )->name('admin.receivables.payments.cancel');

    Route::get(
        '/admin/piutang/pelanggan/{customer}/rincian',
        [AdminReceivableController::class, 'summary']
    )->name('admin.receivables.summary');

    Route::get(
        '/admin/piutang/pelanggan/{customer}/pdf',
        [AdminReceivableController::class, 'pdf']
    )->name('admin.receivables.pdf');

    /*
    |--------------------------------------------------------------------------
    | Data Produk
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/produk',
        [AdminProductController::class, 'index']
    )->name('admin.products.index');

    Route::get(
        '/admin/produk/tambah',
        [AdminProductController::class, 'create']
    )->name('admin.products.create');

    Route::post(
        '/admin/produk',
        [AdminProductController::class, 'store']
    )->name('admin.products.store');

    Route::get(
        '/admin/produk/{id}/ubah',
        [AdminProductController::class, 'edit']
    )->name('admin.products.edit');

    Route::put(
        '/admin/produk/{id}',
        [AdminProductController::class, 'update']
    )->name('admin.products.update');

    Route::patch(
        '/admin/produk/{id}/status',
        [AdminProductController::class, 'toggleStatus']
    )->name('admin.products.toggle-status');

    /*
    |--------------------------------------------------------------------------
    | Data Pelanggan
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/pelanggan',
        [AdminCustomerController::class, 'index']
    )->name('admin.customers.index');

    Route::get(
        '/admin/pelanggan/tambah',
        [AdminCustomerController::class, 'create']
    )->name('admin.customers.create');

    Route::post(
        '/admin/pelanggan',
        [AdminCustomerController::class, 'store']
    )->name('admin.customers.store');

    Route::get(
        '/admin/pelanggan/{id}/ubah',
        [AdminCustomerController::class, 'edit']
    )->name('admin.customers.edit');

    Route::put(
        '/admin/pelanggan/{id}',
        [AdminCustomerController::class, 'update']
    )->name('admin.customers.update');

    Route::patch(
        '/admin/pelanggan/{id}/status',
        [AdminCustomerController::class, 'toggleStatus']
    )->name('admin.customers.toggle-status');

    /*
    |--------------------------------------------------------------------------
    | Laporan
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/laporan',
        [AdminReportController::class, 'index']
    )->name('admin.reports.index');

    Route::get(
        '/admin/laporan/penjualan/pdf',
        [AdminReportController::class, 'salesPdf']
    )->name('admin.reports.sales.pdf');

    Route::get(
        '/admin/laporan/penjualan/print',
        [AdminReportController::class, 'salesPrint']
    )->name('admin.reports.sales.print');

    /*
    |--------------------------------------------------------------------------
    | Kelola Akun
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/admin/users',
        [AdminUserController::class, 'index']
    )->name('admin.users.index');

    Route::get(
        '/admin/users/tambah',
        [AdminUserController::class, 'create']
    )->name('admin.users.create');

    Route::post(
        '/admin/users',
        [AdminUserController::class, 'store']
    )->name('admin.users.store');

    Route::get(
        '/admin/users/{id}/ubah',
        [AdminUserController::class, 'edit']
    )->name('admin.users.edit');

    Route::put(
        '/admin/users/{id}',
        [AdminUserController::class, 'update']
    )->name('admin.users.update');

    Route::patch(
        '/admin/users/{id}/status',
        [AdminUserController::class, 'toggleStatus']
    )->name('admin.users.toggle-status');
});

/*
|--------------------------------------------------------------------------
| Halaman Staff
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'active', 'role:staff'])->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Dashboard Staff
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/staff/dashboard',
        [StaffDashboardController::class, 'index']
    )->name('staff.dashboard');

    /*
    |--------------------------------------------------------------------------
    | Transaksi Pembelian Staff
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/staff/pembelian',
        [StaffPurchaseController::class, 'index']
    )->name('staff.purchases.index');

    Route::get(
        '/staff/pembelian/tambah',
        [StaffPurchaseController::class, 'create']
    )->name('staff.purchases.create');

    Route::post(
        '/staff/pembelian',
        [StaffPurchaseController::class, 'store']
    )->name('staff.purchases.store');

    Route::patch(
        '/staff/pembelian/{id}/batalkan',
        [StaffPurchaseController::class, 'cancel']
    )->name('staff.purchases.cancel');

    /*
    |--------------------------------------------------------------------------
    | Transaksi Penjualan Staff
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/staff/transaksi',
        [StaffSaleController::class, 'index']
    )->name('staff.sales.index');

    Route::get(
        '/staff/transaksi/tambah',
        [StaffSaleController::class, 'create']
    )->name('staff.sales.create');

    Route::post(
        '/staff/transaksi',
        [StaffSaleController::class, 'store']
    )->name('staff.sales.store');

    Route::get(
        '/staff/transaksi/{id}/bon',
        [StaffSaleController::class, 'bon']
    )->name('staff.sales.bon');

    Route::patch(
        '/staff/transaksi/{id}/batalkan',
        [StaffSaleController::class, 'cancel']
    )->name('staff.sales.cancel');

    /*
    |--------------------------------------------------------------------------
    | Data Produk Staff
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/staff/produk',
        [StaffProductController::class, 'index']
    )->name('staff.products.index');

    Route::get(
        '/staff/produk/tambah',
        [StaffProductController::class, 'create']
    )->name('staff.products.create');

    Route::post(
        '/staff/produk',
        [StaffProductController::class, 'store']
    )->name('staff.products.store');

    Route::get(
        '/staff/produk/{id}/ubah',
        [StaffProductController::class, 'edit']
    )->name('staff.products.edit');

    Route::put(
        '/staff/produk/{id}',
        [StaffProductController::class, 'update']
    )->name('staff.products.update');

    Route::patch(
        '/staff/produk/{id}/status',
        [StaffProductController::class, 'toggleStatus']
    )->name('staff.products.toggle-status');

    /*
    |--------------------------------------------------------------------------
    | Data Pelanggan Staff
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/staff/pelanggan',
        [StaffCustomerController::class, 'index']
    )->name('staff.customers.index');

    Route::get(
        '/staff/pelanggan/tambah',
        [StaffCustomerController::class, 'create']
    )->name('staff.customers.create');

    Route::post(
        '/staff/pelanggan',
        [StaffCustomerController::class, 'store']
    )->name('staff.customers.store');

    Route::get(
        '/staff/pelanggan/{id}/ubah',
        [StaffCustomerController::class, 'edit']
    )->name('staff.customers.edit');

    Route::put(
        '/staff/pelanggan/{id}',
        [StaffCustomerController::class, 'update']
    )->name('staff.customers.update');

    Route::patch(
        '/staff/pelanggan/{id}/status',
        [StaffCustomerController::class, 'toggleStatus']
    )->name('staff.customers.toggle-status');
});

/*
|--------------------------------------------------------------------------
| Route Autentikasi Laravel
|--------------------------------------------------------------------------
*/

require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Notifikasi Admin dan Staff
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'active'])->group(function () {
    Route::post(
        '/notifications/read',
        [NotificationController::class, 'read']
    )->name('notifications.read');

    Route::post(
        '/notifications/read-all',
        [NotificationController::class, 'readAll']
    )->name('notifications.read-all');
});