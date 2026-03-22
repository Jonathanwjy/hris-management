<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EmployeeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('employee', [EmployeeController::class, 'index'])->name('employee.index');
    Route::prefix('department')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('department.index');
        Route::get('create', [DepartmentController::class, 'create'])->name('department.create');
        Route::post('store', [DepartmentController::class, 'store'])->name('department.store');
        Route::get('edit/{department}', [DepartmentController::class, 'edit'])->name('depeartment.edit');
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
