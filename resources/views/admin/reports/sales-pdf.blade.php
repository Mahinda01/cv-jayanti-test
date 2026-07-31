<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">

    <title>Laporan Penjualan</title>

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
            padding: 0;
            color: #111827;
            font-family: DejaVu Sans, sans-serif;
            font-size: 9px;
            line-height: 1.35;
        }

        .header-table {
            width: 100%;
            margin-bottom: 8px;
            border-collapse: collapse;
        }

        .header-table td {
            border: none;
            vertical-align: middle;
        }

        .logo-cell {
            width: 80px;
        }

        .logo {
            width: 60px;
            height: 60px;
            object-fit: contain;
        }

        .company-name {
            margin: 0;
            color: #111827;
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .company-address {
            margin-top: 3px;
            color: #374151;
            font-size: 8px;
        }

        .divider {
            margin: 5px 0 13px;
            border-top: 2px solid #111827;
            border-bottom: 1px solid #111827;
            height: 4px;
        }

        .report-title {
            margin: 0;
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .report-period {
            margin-top: 4px;
            margin-bottom: 13px;
            text-align: center;
            color: #374151;
            font-size: 9px;
        }

        .summary-table {
            width: 100%;
            margin-bottom: 13px;
            border-collapse: separate;
            border-spacing: 5px 0;
        }

        .summary-table td {
            width: 25%;
            padding: 8px 10px;
            border: 1px solid #cbd5e1;
            background: #f8fafc;
            vertical-align: top;
        }

        .summary-title {
            color: #475569;
            font-size: 8px;
            font-weight: bold;
        }

        .summary-value {
            margin-top: 4px;
            color: #0f172a;
            font-size: 13px;
            font-weight: bold;
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
            padding: 7px 5px;
            border: 1px solid #94a3b8;
            background: #e2e8f0;
            color: #0f172a;
            text-align: left;
            font-size: 7.5px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .data-table td {
            padding: 7px 5px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
            font-size: 8px;
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
            font-weight: bold;
        }

        .status {
            display: inline-block;
            padding: 2px 6px;
            border: 1px solid #64748b;
            border-radius: 8px;
            color: #1e293b;
            font-size: 7px;
            font-weight: bold;
        }

        .empty-row {
            padding: 18px !important;
            text-align: center;
            color: #64748b;
        }

        .footer {
            margin-top: 12px;
            color: #475569;
            font-size: 7.5px;
        }

        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }

        .footer-table td {
            border: none;
        }

        .footer-right {
            text-align: right;
        }
    </style>
</head>

<body>
    @php
        $logoPath = public_path('images/logo/logo-cv-jayanti.png');

        $logoBase64 = file_exists($logoPath)
            ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
            : null;
    @endphp

    <table class="header-table">
        <tr>
            <td class="logo-cell">
                @if ($logoBase64)
                    <img
                        src="{{ $logoBase64 }}"
                        alt="Logo CV Jayanti Muliatama"
                        class="logo"
                    >
                @endif
            </td>

            <td>
                <h1 class="company-name">
                    CV Jayanti Muliatama
                </h1>

                <div class="company-address">
                    Jl. Karya Sehati No.20, Polonia, Kecamatan Medan Polonia,
                    Kota Medan, Sumatera Utara 20157
                </div>

                <div class="company-address">
                    Telepon/WhatsApp: 0821-7436-9753
                </div>
            </td>
        </tr>
    </table>

    <div class="divider"></div>

    <h2 class="report-title">
        Laporan Penjualan
    </h2>

    <div class="report-period">
        Periode {{ $startDateText }} sampai {{ $endDateText }}
    </div>

    <table class="summary-table">
        <tr>
            <td>
                <div class="summary-title">
                    TOTAL TRANSAKSI
                </div>

                <div class="summary-value">
                    {{ $summary['transaction_count'] ?? 0 }}
                </div>
            </td>

            <td>
                <div class="summary-title">
                    TOTAL PENJUALAN
                </div>

                <div class="summary-value">
                    {{ $summary['total_sales'] ?? 'Rp 0' }}
                </div>
            </td>

            <td>
                <div class="summary-title">
                    TOTAL DIBAYAR
                </div>

                <div class="summary-value">
                    {{ $summary['total_paid'] ?? 'Rp 0' }}
                </div>
            </td>

            <td>
                <div class="summary-title">
                    TOTAL PIUTANG
                </div>

                <div class="summary-value">
                    {{ $summary['total_remaining'] ?? 'Rp 0' }}
                </div>
            </td>
        </tr>
    </table>

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

    <div class="footer">
        <table class="footer-table">
            <tr>
                <td>
                    Dokumen ini dibuat melalui Sistem Informasi CV Jayanti Muliatama.
                </td>

                <td class="footer-right">
                    Dicetak pada {{ $printedAt }}
                </td>
            </tr>
        </table>
    </div>
</body>
</html>