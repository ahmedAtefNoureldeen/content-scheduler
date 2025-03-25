<?php

namespace App\Console\Commands;

use App\Jobs\ProcessScheduledPosts;
use Illuminate\Console\Command;

class PublishScheduledPosts extends Command
{
    protected $signature = 'posts:publish';
    protected $description = 'Process and publish scheduled posts';

    public function handle()
    {
        $this->info('Starting to process scheduled posts...');
        ProcessScheduledPosts::dispatch();
        $this->info('Scheduled posts processing job dispatched successfully.');
        
        return 0;
    }
}
