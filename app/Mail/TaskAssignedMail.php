<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Employee;
use App\Models\Task;

class TaskAssignedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $task;
    public $employee;

    /**
     * Create a new message instance.
     */
    public function __construct(Task $task, Employee $employee)
    {
        $this->task = $task;
        $this->employee = $employee;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Tugas Baru: ' . $this->task->title,
        );
    }
    /**
     * Get the message content definition.
     */
    // Atur file tampilan (View) HTML untuk emailnya
    public function content(): Content
    {
        return new Content(
            view: 'emails.task.created',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
