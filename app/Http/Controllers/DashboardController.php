<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DashboardService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $analyticsData = $this->dashboardService->getAnalyticsData();

        return Inertia::render('admin/dashboard/index', [
            'analytics' => $analyticsData,
        ]);
    }
}
