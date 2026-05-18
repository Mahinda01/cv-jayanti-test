<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Public/Home');
})->name('home');

Route::get('/produk/{slug}', function ($slug) {
    return Inertia::render('Public/ProductDetail', [
        'slug' => $slug,
    ]);
})->name('public.products.show');

/*
|--------------------------------------------------------------------------
| Login Page Admin & Staff
|--------------------------------------------------------------------------
*/

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
| Role Dashboard Redirect
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
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/admin/dashboard', function () {
    if (Auth::user()->role !== 'admin') {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Admin/Dashboard');
})->middleware(['auth', 'verified'])->name('admin.dashboard');

/*
|--------------------------------------------------------------------------
| Staff Dashboard
|--------------------------------------------------------------------------
*/

Route::get('/staff/dashboard', function () {
    if (Auth::user()->role !== 'staff') {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Staff/Dashboard');
})->middleware(['auth', 'verified'])->name('staff.dashboard');

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';