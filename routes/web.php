<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'admin'])->group(function () {


    Route::resource('department', DepartmentController::class);
    Route::patch('department/toggle-status/{department}', [DepartmentController::class, 'toggleStatus'])->name('');

    Route::resource('role', RoleController::class);

    Route::resource('employee', EmployeeController::class);
    Route::patch('toggle-status/{employee}', [EmployeeController::class, 'toggleStatus'])->name('');
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
