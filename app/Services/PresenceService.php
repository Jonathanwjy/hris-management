<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use App\Models\Presence;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class PresenceService
{

    const OFFICE_LAT = -2.9215;
    const OFFICE_LONG = 104.784917;
    const MAX_RADIUS = 100;

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371000; // Radius bumi dalam meter

        // Konversi derajat ke radian
        $lat1 = deg2rad((float) $lat1);
        $lon1 = deg2rad((float) $lon1);
        $lat2 = deg2rad((float) $lat2);
        $lon2 = deg2rad((float) $lon2);

        $latDelta = $lat2 - $lat1;
        $lonDelta = $lon2 - $lon1;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos($lat1) * cos($lat2) *
            sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return floor($earthRadius * $c);
    }
    public function store(array $data): Presence
    {
        $user = Auth::user();
        $employee = $user->employee;

        if (!empty($data['clock_in_latitude']) && !empty($data['clock_in_longitude'])) {
            $distance = $this->calculateDistance(
                self::OFFICE_LAT,
                self::OFFICE_LONG,
                $data['clock_in_latitude'],
                $data['clock_in_longitude']
            );

            if ($distance > self::MAX_RADIUS) {
                // Lempar pesan error yang akan otomatis ditangkap oleh Inertia/React
                throw ValidationException::withMessages([
                    'clock_in_latitude' => "Gagal absen! Anda berada di luar area kantor (Jarak: {$distance} meter). Maksimal radius adalah " . self::MAX_RADIUS . " meter."
                ]);
            }
        }

        if (!empty($data['check_in_time']) && !empty($data['date'])) {
            $data['check_in_time'] = $data['date'] . ' ' . $data['check_in_time'] . ':00';
        }

        $data['employee_id'] = $employee->id;

        // 2. Jika validasi aman, baru simpan datanya
        return DB::transaction(function () use ($data) {
            return Presence::create($data);
        });
    }
}
