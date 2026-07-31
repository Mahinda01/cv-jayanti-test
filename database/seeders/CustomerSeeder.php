<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $customers = [
            [
                'name' => 'PT Industri Jaya',
                'contact' => '0812-3456-7890',
                'address' => 'Jl. Industri No. 45, Medan',
            ],
            [
                'name' => 'CV Teknik Mandiri',
                'contact' => '0821-5566-7788',
                'address' => 'Jl. Krakatau, Medan',
            ],
            [
                'name' => 'PT Baja Karya',
                'contact' => '0813-2222-9090',
                'address' => 'Jl. Cemara, Medan',
            ],
            [
                'name' => 'UD Sumber Hidrolik',
                'contact' => '0822-1122-3344',
                'address' => 'Jl. Pancing, Medan',
            ],
            [
                'name' => 'Bengkel Maju Jaya',
                'contact' => '0812-9090-8877',
                'address' => 'Jl. Gatot Subroto, Medan',
            ],
            [
                'name' => 'CV Anugerah Teknik',
                'contact' => '0852-7777-1234',
                'address' => 'Jl. Setia Budi, Medan',
            ],
            [
                'name' => 'PT Karya Mesin Nusantara',
                'contact' => '0811-9088-7766',
                'address' => 'Jl. Ringroad, Medan',
            ],
            [
                'name' => 'Toko Hidrolik Sejahtera',
                'contact' => '0823-4444-5566',
                'address' => 'Jl. Asia, Medan',
            ],
        ];

        DB::transaction(function () use ($customers) {
            foreach ($customers as $customer) {
                Customer::updateOrCreate(
                    [
                        'name' => $customer['name'],
                    ],
                    [
                        'contact' => $customer['contact'],
                        'address' => $customer['address'],
                    ]
                );
            }
        });
    }
}