<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Customer::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $customers = [
            [
                'name' => 'PT Industri Jaya',
                'contact' => '0812-3456-7890',
                'address' => 'Jl. Industri No. 45, Medan',
                'total_receivable' => 8450000,
                'receivable_status' => 'Belum Lunas',
                'is_active' => true,
            ],
            [
                'name' => 'CV Teknik Mandiri',
                'contact' => '0821-5566-7788',
                'address' => 'Jl. Krakatau, Medan',
                'total_receivable' => 0,
                'receivable_status' => 'Tidak Ada Piutang',
                'is_active' => true,
            ],
            [
                'name' => 'PT Baja Karya',
                'contact' => '0813-2222-9090',
                'address' => 'Jl. Cemara, Medan',
                'total_receivable' => 12750000,
                'receivable_status' => 'Jatuh Tempo',
                'is_active' => true,
            ],
            [
                'name' => 'UD Sumber Hidrolik',
                'contact' => '0822-1122-3344',
                'address' => 'Jl. Pancing, Medan',
                'total_receivable' => 3500000,
                'receivable_status' => 'Belum Lunas',
                'is_active' => true,
            ],
            [
                'name' => 'Bengkel Maju Jaya',
                'contact' => '0812-9090-8877',
                'address' => 'Jl. Gatot Subroto, Medan',
                'total_receivable' => 0,
                'receivable_status' => 'Tidak Ada Piutang',
                'is_active' => true,
            ],
            [
                'name' => 'CV Anugerah Teknik',
                'contact' => '0852-7777-1234',
                'address' => 'Jl. Setia Budi, Medan',
                'total_receivable' => 6200000,
                'receivable_status' => 'Belum Lunas',
                'is_active' => true,
            ],
            [
                'name' => 'PT Karya Mesin Nusantara',
                'contact' => '0811-9088-7766',
                'address' => 'Jl. Ringroad, Medan',
                'total_receivable' => 15400000,
                'receivable_status' => 'Jatuh Tempo',
                'is_active' => false,
            ],
            [
                'name' => 'Toko Hidrolik Sejahtera',
                'contact' => '0823-4444-5566',
                'address' => 'Jl. Asia, Medan',
                'total_receivable' => 0,
                'receivable_status' => 'Tidak Ada Piutang',
                'is_active' => true,
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}