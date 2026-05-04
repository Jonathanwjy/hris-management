<?php

namespace App\Jobs;

use App\Models\Task;
use App\Models\Employee;
use App\Mail\TaskAssignedMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendTaskAssignmentEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $task;
    public $employee;

    /**
     * Create a new job instance.
     */
    public function __construct(Task $task, Employee $employee)
    {
        $this->task = $task;
        $this->employee = $employee;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // Logika pengiriman email yang sebelumnya di Controller
        Mail::to($this->employee->email)->send(new TaskAssignedMail($this->task, $this->employee));
    }
}
