<!DOCTYPE html>
<html>

<head>
    <title>Tugas Baru Ditugaskan</title>
</head>

<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Halo, {{ $employee->full_name }}!</h2>

    <p>Anda telah ditugaskan untuk mengerjakan tugas baru oleh Admin. Berikut adalah detail tugasnya:</p>

    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
        <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 8px;"><strong>Judul Tugas:</strong> {{ $task->title }}</li>
            <li style="margin-bottom: 8px;"><strong>Tenggat Waktu:</strong> {{ \Carbon\Carbon::parse($task->due_date)->format('d F Y') }}</li>
            <li><strong>Deskripsi:</strong> <br> {{ $task->description ?? 'Tidak ada deskripsi.' }}</li>
        </ul>
    </div>

    <p>Silakan login ke sistem HRIS/Task Management untuk melihat detail lebih lanjut dan memperbarui status pengerjaan Anda.</p>

    <p>Terima kasih,<br>Tim HR & Admin</p>
</body>

</html>