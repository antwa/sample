<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;


class EmployeeController extends Controller
{

    public function save(Request $req)
    {
        dd($req->input());
    }
}