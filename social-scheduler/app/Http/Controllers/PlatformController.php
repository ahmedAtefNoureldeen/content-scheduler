<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $platforms = Platform::leftJoin('platform_user', function ($join) use ($user) {
            $join->on('platforms.id', '=', 'platform_user.platform_id')
                ->where('platform_user.user_id', '=', $user->id);
        })
        ->select('platforms.*', 'platform_user.is_active')
        ->get();

        return response()->json($platforms);
    }

    public function toggleActive(Request $request, $id)
    {
        $platform = Platform::findOrFail($id);
        $user = $request->user();

        // Check if the relationship exists
        $pivot = $user->platforms()->where('platform_id', $platform->id)->first();

        if ($pivot) {
            // Toggle the is_active value
            $isActive = !$pivot->pivot->is_active;
            $user->platforms()->updateExistingPivot($platform->id, ['is_active' => $isActive]);
        } else {
            // Create a new relationship with is_active = true
            $user->platforms()->attach($platform->id, ['is_active' => true]);
            $isActive = true;
        }

        return response()->json([
            'message' => 'Platform status toggled successfully',
            'platform' => $platform->name,
            'is_active' => $isActive
        ]);
    }
}
