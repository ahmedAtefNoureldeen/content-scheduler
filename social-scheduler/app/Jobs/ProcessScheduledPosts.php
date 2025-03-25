<?php

namespace App\Jobs;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessScheduledPosts implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle()
    {
        $posts = Post::where('status', 'scheduled')
            ->where('scheduled_time', '<=', now())
            ->get();

        foreach ($posts as $post) {
            // Update post status
            $post->status = 'published';
            $post->save();

            // Process each platform
            foreach ($post->platforms as $platform) {
                // Mock the actual publishing process
                $this->publishToSocialMedia($post, $platform);
                
                // Update pivot table
                $post->platforms()->updateExistingPivot($platform->id, [
                    'platform_status' => 'published'
                ]);
            }

            Log::info("Post ID: {$post->id} published successfully");
        }
    }

    protected function publishToSocialMedia($post, $platform)
    {
        // In a real application, this would connect to the platform's API
        // For this challenge, we'll just mock the publishing process
        Log::info("Publishing post {$post->id} to {$platform->name}");
        
        // Simulate API delay
        sleep(1);
        
        // Return successful publishing (in a real app, this would check the API response)
        return true;
    }
}
