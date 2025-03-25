<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with('platforms')->where('user_id', $request->user()->id);
        
        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('date')) {
            $query->whereDate('scheduled_time', $request->date);
        }
        
        return response()->json($query->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image_url' => 'nullable|url',
            'scheduled_time' => 'required|date|after:now',
            'platforms' => 'sometimes|array',
            'platforms.*' => 'exists:platforms,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validate platform-specific requirements
        foreach ($request->platforms as $platformId) {
            $platform = Platform::find($platformId);
            $this->validatePlatformRequirements($platform, $request->content, $request->image_url);
        }

        $post = new Post([
            'title' => $request->title,
            'content' => $request->content,
            'image_url' => $request->image_url,
            'scheduled_time' => $request->scheduled_time,
            'status' => 'scheduled',
            'user_id' => $request->user()->id,
        ]);

        $post->save();

        // Attach platforms
        foreach ($request->platforms as $platformId) {
            $post->platforms()->attach($platformId, ['platform_status' => 'pending']);
        }

        return response()->json([
            'message' => 'Post scheduled successfully',
            'post' => $post->load('platforms')
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $post = Post::with('platforms')->where('user_id', $request->user()->id)->findOrFail($id);
        return response()->json($post);
    }

    public function update(Request $request, $id)
    {
        $post = Post::where('user_id', $request->user()->id)->findOrFail($id);
        
        // Only draft or scheduled posts can be updated
        if ($post->status === 'published') {
            return response()->json(['message' => 'Published posts cannot be updated'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'image_url' => 'nullable|url',
            'scheduled_time' => 'sometimes|date|after:now',
            'platforms' => 'sometimes|array_or_integer',
            'platforms.*' => 'exists:platforms,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Validate platform-specific requirements if content or platforms are updated
        if ($request->has('content') || $request->has('platforms')) {
            $platformIds = $request->has('platforms') ? $request->platforms : $post->platforms->pluck('id')->toArray();
            $content = $request->has('content') ? $request->content : $post->content;
            $imageUrl = $request->has('image_url') ? $request->image_url : $post->image_url;
            
            foreach ($platformIds as $platformId) {
                $platform = Platform::find($platformId);
                $this->validatePlatformRequirements($platform, $content, $imageUrl);
            }
        }

        $post->update($request->only(['title', 'content', 'image_url', 'scheduled_time']));

        // Update platforms if provided
        if ($request->has('platforms')) {
            $post->platforms()->sync(collect($request->platforms)->mapWithKeys(function ($platformId) {
                return [$platformId => ['platform_status' => 'pending']];
            }));
        }

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post->load('platforms')
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $post = Post::where('user_id', $request->user()->id)->findOrFail($id);
        $post->delete();

        return response()->json(['message' => 'Post deleted successfully']);
    }

    protected function validatePlatformRequirements($platform, $content, $imageUrl)
    {
        $errors = [];

        // Check platform-specific requirements
        switch ($platform->type) {
            case 'twitter':
                if (mb_strlen($content) > 280) {
                    $errors[] = "Twitter posts must be 280 characters or less";
                }
                break;
            case 'instagram':
                if (empty($imageUrl)) {
                    $errors[] = "Instagram posts require an image";
                }
                break;
            case 'linkedin':
                if (mb_strlen($content) > 3000) {
                    $errors[] = "LinkedIn posts must be 3000 characters or less";
                }
                break;
        }

        if (!empty($errors)) {
            abort(422, json_encode($errors));
        }
    }
}