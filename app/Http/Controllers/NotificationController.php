<?php

namespace App\Http\Controllers;

use App\Models\NotificationRead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function read(Request $request)
    {
        $validated = $request->validate([
            'notification_key' => ['required', 'string', 'max:255'],
            'redirect_to' => ['nullable', 'string', 'max:255'],
        ]);

        NotificationRead::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'notification_key' => $validated['notification_key'],
            ],
            [
                'read_at' => now(),
            ],
        );

        $redirectTo = $validated['redirect_to'] ?? url()->previous();

        if (
            !str_starts_with($redirectTo, url('/')) &&
            !str_starts_with($redirectTo, '/')
        ) {
            $redirectTo = route('dashboard');
        }

        return redirect()->to($redirectTo);
    }

    public function readAll(Request $request)
    {
        $validated = $request->validate([
            'notification_keys' => ['required', 'array'],
            'notification_keys.*' => ['required', 'string', 'max:255'],
        ]);

        foreach (array_unique($validated['notification_keys']) as $key) {
            NotificationRead::updateOrCreate(
                [
                    'user_id' => Auth::id(),
                    'notification_key' => $key,
                ],
                [
                    'read_at' => now(),
                ],
            );
        }

        return back();
    }
}