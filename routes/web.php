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

    Route::prefix('department')->group(function () {
        Route::get('/', [DepartmentController::class, 'index'])->name('department.index');
        Route::get('create', [DepartmentController::class, 'create'])->name('department.create');
        Route::post('store', [DepartmentController::class, 'store'])->name('department.store');
        Route::get('edit/{department}', [DepartmentController::class, 'edit'])->name('department.edit');
        Route::put('update/{department}', [DepartmentController::class, 'update'])->name('depeartment.update');
        Route::patch('toggle-status/{department}', [DepartmentController::class, 'toggleStatus'])->name('');
    });

    Route::prefix('role')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('role.index');
        Route::get('create', [RoleController::class, 'create'])->name('role.create');
        Route::post('store', [RoleController::class, 'store'])->name('role.store');
        Route::get('edit/{role}', [RoleController::class, 'edit'])->name('role.edit');
        Route::put('update/{role}', [RoleController::class, 'update'])->name('role.update');
    });

    Route::prefix('employee')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('employee.index');
        Route::get('create', [EmployeeController::class, 'create'])->name('employee.create');
        Route::post('store', [EmployeeController::class, 'store'])->name('employee.store');
        Route::get('edit/{employee}', [EmployeeController::class, 'edit'])->name('employee.edit');
        Route::put('update/{employee}', [EmployeeController::class, 'update'])->name('employee.update');
        Route::get('show/{employee}', [EmployeeController::class, 'show'])->name('employee.show');
        Route::patch('toggle-status/{employee}', [EmployeeController::class, 'toggleStatus'])->name('');
    });
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
