<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->is_active) {
            $role = $user->role;

            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $loginRoute = $role === 'staff'
                ? 'login.staff'
                : 'login.admin';

            return redirect()
                ->route($loginRoute)
                ->withErrors([
                    'username' => 'Akun pengguna telah dinonaktifkan.',
                ]);
        }

        return $next($request);
    }
}