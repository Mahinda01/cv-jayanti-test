<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login.admin');
        }

        $user = Auth::user();

        if (! $user->is_active) {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()
                ->route('login.admin')
                ->withErrors([
                    'username' => 'Akun pengguna tidak aktif. Silakan hubungi admin.',
                ]);
        }

        if ($user->role !== $role) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}