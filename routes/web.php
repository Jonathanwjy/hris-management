<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PresenceController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'admin'])->group(function () {

    Route::resource('department', DepartmentController::class)->except('delete');
    Route::patch('department/toggle-status/{department}', [DepartmentController::class, 'toggleStatus'])->name('');

    Route::resource('role', RoleController::class)->except('delete');
    Route::patch('role/toggle-status/{role}', [RoleController::class, 'toggleStatus'])->name('');

    Route::resource('employee', EmployeeController::class)->except('delete');
    Route::patch('employee/toggle-status/{employee}', [EmployeeController::class, 'toggleStatus'])->name('');
    Route::patch('employee/{employee}/fire', [EmployeeController::class, 'fireEmployee']);

    Route::prefix('admin')->group(function () {
        Route::get('leave', [LeaveRequestController::class, 'adminIndex'])->name('leave.admin.index');
        Route::get('leave/{leave}', [LeaveRequestController::class, 'show'])->name('leave.admin.show');
        Route::patch('leave/{leaveRequest}/accept-request', [LeaveRequestController::class, 'acceptRequest'])->name('leave.admin.acceptRequest');
        Route::patch('leave/{leaveRequest}/decline-request', [LeaveRequestController::class, 'declineRequest'])->name('leave.admin.declineRequest');
    });
});

Route::middleware(['auth', 'user'])->group(function () {
    Route::prefix('user')->group(function () {
        Route::resource('leave', LeaveRequestController::class)->except('delete', 'edit');
        Route::get('presence/create-absence', [PresenceController::class, 'createAbsence'])->name('presence.absence');
        Route::resource('presence', PresenceController::class)->except('delete', 'edit');
        Route::get('presence/{presence}/out', [PresenceController::class, 'PresenceOut'])->name('presence.out');
        Route::put('presence/{presence}', [PresenceController::class, 'StorePresenceOut'])->name('presence.out');
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
