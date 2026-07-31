<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Print Laporan Penjualan</title>

    <style>
        @page {
            size: A4 landscape;
            margin: 11mm 10mm 13mm 10mm;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 20px;
            background: #e2e8f0;
            color: #111827;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }

        .toolbar {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            max-width: 1120px;
            margin: 0 auto 14px;
        }

        .toolbar button {
            padding: 10px 18px;
            border: none;
            border-radius: 8px;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
        }

        .back-button {
            background: #475569;
            color: #ffffff;
        }

        .print-button {
            background: #155dfc;
            color: #ffffff;
        }

        .paper {
            width: 100%;
            max-width: 1120px;
            min-height: 760px;
            margin: 0 auto;
            padding: 28px;
            background: #ffffff;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
        }

        .header {
            display: flex;
            align-items: center;
            gap: 18px;
        }

        .logo {
            width: 72px;
            height: 72px;
            object-fit: contain;
        }

        .company-name {
            margin: 0;
            color: #111827;
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .company-address {
            margin-top: 3px;
            color: #475569;
            font-size: 11px;
        }

        .divider {
            height: 5px;
            margin: 12px 0 20px;
            border-top: 3px solid #111827;
            border-bottom: 1px solid #111827;
        }

        .report-title {
            margin: 0;
            text-align: center;
            font-size: 20px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .report-period {
            margin-top: 5px;
            margin-bottom: 20px;
            text-align: center;
            color: #475569;
            font-size: 12px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 18px;
        }

        .summary-box {
            padding: 12px;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
        }

        .summary-title {
            color: #475569;
            font-size: 10px;
            font-weight: 700;
        }

        .summary-value {
            margin-top: 5px;
            color: #0f172a;
            font-size: 17px;
            font-weight: 800;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .data-table thead {
            display: table-header-group;
        }

        .data-table tr {
            page-break-inside: avoid;
        }

        .data-table th {
            padding: 8px 6px;
            border: 1px solid #94a3b8;
            background: #e2e8f0;
            color: #0f172a;
            text-align: left;
            font-size: 9px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .data-table td {
            padding: 8px 6px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
            font-size: 10px;
            word-wrap: break-word;
        }

        .data-table tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .number-column {
            width: 4%;
            text-align: center;
        }

        .date-column {
            width: 10%;
        }

        .invoice-column {
            width: 17%;
        }

        .customer-column {
            width: 17%;
        }

        .amount-column {
            width: 13%;
        }

        .method-column {
            width: 13%;
        }

        .status-column {
            width: 13%;
        }

        .creator-column {
            width: 13%;
        }

        .amount {
            white-space: nowrap;
            font-weight: 800;
        }

        .status {
            display: inline-block;
            padding: 2px 7px;
            border: 1px solid #64748b;
            border-radius: 10px;
            color: #1e293b;
            font-size: 9px;
            font-weight: 700;
        }

        .empty-row {
            padding: 20px !important;
            text-align: center;
            color: #64748b;
        }

        .footer {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-top: 15px;
            color: #475569;
            font-size: 9px;
        }

        @media print {
            body {
                padding: 0;
                background: #ffffff;
                color: #000000;
            }

            .no-print {
                display: none !important;
            }

            .paper {
                max-width: none;
                min-height: 0;
                margin: 0;
                padding: 0;
                box-shadow: none;
            }

            .data-table tbody tr:nth-child(even) {
                background: #f8fafc !important;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }

            .data-table th,
            .summary-box {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>

<body>
    <div class="toolbar no-print">
        <button
            type="button"
            class="back-button"
            onclick="window.close()"
        >
            Tutup
        </button>

        <button
            type="button"
            class="print-button"
            onclick="window.print()"
        >
            Cetak Sekarang
        </button>
    </div>

    <main class="paper">
        <div class="header">
            <img
                src="{{ asset('images/logo/logo-cv-jayanti.png') }}"
                alt="Logo CV Jayanti Muliatama"
                class="logo"
            >

            <div>
                <h1 class="company-name">
                    CV Jayanti Muliatama
                </h1>

                <div class="company-address">
                    Jl. Karya Sehati No.20, Polonia,
                    Kecamatan Medan Polonia, Kota Medan,
                    Sumatera Utara 20157
                </div>

                <div class="company-address">
                    Telepon/WhatsApp: 0821-7436-9753
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <h2 class="report-title">
            Laporan Penjualan
        </h2>

        <div class="report-period">
            Periode {{ $startDateText }} sampai {{ $endDateText }}
        </div>

        <section class="summary-grid">
            <div class="summary-box">
                <div class="summary-title">
                    TOTAL TRANSAKSI
                </div>

                <div class="summary-value">
                    {{ $summary['transaction_count'] ?? 0 }}
                </div>
            </div>

            <div class="summary-box">
                <div class="summary-title">
                    TOTAL PENJUALAN
                </div>

                <div class="summary-value">
                    {{ $summary['total_sales'] ?? 'Rp 0' }}
                </div>
            </div>

            <div class="summary-box">
                <div class="summary-title">
                    TOTAL DIBAYAR
                </div>

                <div class="summary-value">
                    {{ $summary['total_paid'] ?? 'Rp 0' }}
                </div>
            </div>

            <div class="summary-box">
                <div class="summary-title">
                    TOTAL PIUTANG
                </div>

                <div class="summary-value">
                    {{ $summary['total_remaining'] ?? 'Rp 0' }}
                </div>
            </div>
        </section>

        <table class="data-table">
            <thead>
                <tr>
                    <th class="number-column">No.</th>
                    <th class="date-column">Tanggal</th>
                    <th class="invoice-column">No. Invoice</th>
                    <th class="customer-column">Pelanggan</th>
                    <th class="amount-column">Total Transaksi</th>
                    <th class="method-column">Metode Pembayaran</th>
                    <th class="status-column">Status Pembayaran</th>
                    <th class="creator-column">Dibuat Oleh</th>
                </tr>
            </thead>

            <tbody>
                @forelse ($sales as $index => $sale)
                    <tr>
                        <td class="number-column">
                            {{ $index + 1 }}
                        </td>

                        <td>
                            {{ $sale['sale_date'] }}
                        </td>

                        <td>
                            <strong>
                                {{ $sale['invoice_number'] }}
                            </strong>
                        </td>

                        <td>
                            {{ $sale['customer_name'] }}
                        </td>

                        <td class="amount">
                            {{ $sale['total_amount_text'] }}
                        </td>

                        <td>
                            {{ $sale['payment_method'] }}
                        </td>

                        <td>
                            <span class="status">
                                {{ $sale['payment_status'] }}
                            </span>
                        </td>

                        <td>
                            {{ $sale['created_by'] }}
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="empty-row">
                            Tidak ada data penjualan pada periode yang dipilih.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <footer class="footer">
            <span>
                Dokumen ini dibuat melalui Sistem Informasi
                CV Jayanti Muliatama.
            </span>

            <span>
                Dicetak pada {{ $printedAt }}
            </span>
        </footer>
    </main>

    <script>
        window.addEventListener('load', function () {
            setTimeout(function () {
                window.print();
            }, 500);
        });
    </script>
</body>
</html>