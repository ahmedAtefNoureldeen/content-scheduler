<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SocialPostSeeder extends Seeder
{
    public function run()
    {
        DB::table('social_posts')->insert([
            [
                'user_id' => 1,
                'platform' => 'twitter',
                'content' => 'First scheduled post from Social Scheduler! #SocialMedia #Automation',
                'scheduled_at' => now()->addDays(7),
                'status' => 'scheduled',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'platform' => 'linkedin',
                'content' => 'Excited to share our new productivity tool for social media management!',
                'scheduled_at' => now()->addDays(14),
                'status' => 'scheduled',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}