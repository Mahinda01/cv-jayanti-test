<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Rincian Piutang Pelanggan</title>
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: DejaVu Sans, Arial, sans-serif;
            color: #111827;
            background: #ffffff;
            font-size: 11px;
        }

        .page {
            padding: 18px 22px 16px;
        }

        .letterhead {
            display: table;
            width: 100%;
            margin-bottom: 8px;
        }

        .logo-box {
            display: table-cell;
            width: 145px;
            vertical-align: middle;
            text-align: center;
        }

        .logo-box img {
            width: 112px;
            height: 112px;
            object-fit: contain;
        }

        .company-info {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            padding-right: 40px;
            padding-top: 10px;
        }

        .company-info h1 {
            margin: 0 0 7px 0;
            font-size: 29px;
            font-weight: bold;
            letter-spacing: 0.8px;
            color: #050505;
            line-height: 1.05;
        }

        .company-info h2 {
            margin: 0 0 7px 0;
            font-size: 20px;
            font-weight: bold;
            color: #f2b300;
            letter-spacing: 0.4px;
            line-height: 1.1;
        }

        .company-info p {
            margin: 2px 0;
            font-size: 14px;
            color: #111111;
            line-height: 1.25;
        }

        .line-black {
            height: 5px;
            background: #111111;
            margin-top: 8px;
        }

        .line-yellow {
            height: 4px;
            background: #f2b300;
            margin-bottom: 16px;
        }

        .document-title {
            text-align: center;
            margin-bottom: 14px;
        }

        .document-title h3 {
            margin: 0;
            font-size: 18px;
            letter-spacing: 0.8px;
            color: #111827;
        }

        .document-title p {
            margin: 4px 0 0;
            font-size: 10px;
            color: #64748b;
        }

        .section {
            margin-bottom: 12px;
        }

        .section-title {
            margin: 0 0 7px 0;
            padding-bottom: 5px;
            border-bottom: 2px solid #f2b300;
            font-size: 12px;
            font-weight: bold;
            color: #131d31;
            letter-spacing: 0.3px;
            text-transform: uppercase;
        }

        .info-layout {
            display: table;
            width: 100%;
            margin-bottom: 12px;
        }

        .info-left,
        .info-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .info-left {
            padding-right: 12px;
        }

        .info-right {
            padding-left: 12px;
        }

        .info-row {
            display: table;
            width: 100%;
            margin-bottom: 5px;
        }

        .info-label {
            display: table-cell;
            width: 105px;
            color: #475569;
            font-weight: bold;
        }

        .info-separator {
            display: table-cell;
            width: 10px;
            color: #111827;
            font-weight: bold;
        }

        .info-value {
            display: table-cell;
            color: #111827;
            font-weight: bold;
        }

        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 13px;
        }

        .summary-table td {
            border: 1px solid #d9e2f1;
            padding: 9px 10px;
        }

        .summary-label {
            color: #475569;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .summary-value {
            margin-top: 3px;
            font-size: 13px;
            font-weight: bold;
            color: #111827;
        }

        .summary-value.highlight {
            color: #c2410c;
            font-size: 15px;
        }

        .status-text {
            color: #b91c1c;
        }

        .detail-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
        }

        .detail-table th {
            background: #131d31;
            color: #ffffff;
            font-size: 9px;
            padding: 8px 6px;
            border: 1px solid #26364f;
            text-align: left;
        }

        .detail-table td {
            padding: 8px 6px;
            border: 1px solid #d9e2f1;
            vertical-align: top;
            font-size: 9px;
            color: #111827;
        }

        .detail-table tr:nth-child(even) td {
            background: #f8fafc;
        }

        .text-right {
            text-align: right;
        }

        .status {
            font-weight: bold;
        }

        .status-lunas {
            color: #15803d;
        }

        .status-belum {
            color: #b45309;
        }

        .status-jatuh {
            color: #b91c1c;
        }

        .note-box {
            margin-top: 14px;
            padding: 10px 12px;
            border: 1px solid #f2b300;
            background: #fffdf3;
            color: #713f12;
            font-size: 10px;
            line-height: 1.55;
        }

        .signature-layout {
            display: table;
            width: 100%;
            margin-top: 18px;
        }

        .signature-left,
        .signature-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .signature-right {
            text-align: center;
        }

        .signature-space {
            height: 46px;
        }

        .footer {
            margin-top: 12px;
            padding-top: 8px;
            border-top: 1px solid #d9e2f1;
            text-align: center;
            color: #64748b;
            font-size: 9px;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="letterhead">
            <div class="logo-box">
                @if(file_exists($logoPath))
                    <img src="{{ $logoPath }}" alt="Logo">
                @endif
            </div>

            <div class="company-info">
                <h1>CV JAYANTI MULIATAMA</h1>
                <h2>HYDRAULIC HOSE &amp; COMPONENTS</h2>
                <p>Jl. Karya Sehati No. 20. Telp. 082174369753</p>
                <p>Medan - Sumatra Utara</p>
            </div>
        </div>

        <div class="line-black"></div>
        <div class="line-yellow"></div>

        <div class="document-title">
            <h3>RINCIAN PIUTANG PELANGGAN</h3>
            <p>Dokumen ini dibuat berdasarkan data piutang terbaru pada sistem.</p>
        </div>

        <div class="info-layout">
            <div class="info-left">
                <p class="section-title">Data Pelanggan</p>

                <div class="info-row">
                    <span class="info-label">Nama</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">{{ $customer->name }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Kontak</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">{{ $customer->contact ?: '-' }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Alamat</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">{{ $customer->address ?: '-' }}</span>
                </div>
            </div>

            <div class="info-right">
                <p class="section-title">Informasi Dokumen</p>

                <div class="info-row">
                    <span class="info-label">Tanggal Cetak</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">{{ $createdAt }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Status</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">{{ $summary['status'] }}</span>
                </div>

                <div class="info-row">
                    <span class="info-label">Jumlah Data</span>
                    <span class="info-separator">:</span>
                    <span class="info-value">{{ $summary['active_count'] }} piutang aktif</span>
                </div>
            </div>
        </div>

        <table class="summary-table">
            <tr>
                <td>
                    <div class="summary-label">Total Tagihan</div>
                    <div class="summary-value">{{ $summary['total_amount_text'] }}</div>
                </td>
                <td>
                    <div class="summary-label">Total Dibayar</div>
                    <div class="summary-value">{{ $summary['paid_amount_text'] }}</div>
                </td>
                <td>
                    <div class="summary-label">Sisa Piutang</div>
                    <div class="summary-value highlight">{{ $summary['remaining_amount_text'] }}</div>
                </td>
                <td>
                    <div class="summary-label">Status</div>
                    <div class="summary-value status-text">{{ $summary['status'] }}</div>
                </td>
            </tr>
        </table>

        <div class="section">
            <p class="section-title">Detail Piutang</p>

            <table class="detail-table">
                <thead>
                    <tr>
                        <th style="width: 4%;">No</th>
                        <th style="width: 13%;">Sumber</th>
                        <th style="width: 15%;">No Transaksi / Bon</th>
                        <th style="width: 11%;">Tanggal</th>
                        <th style="width: 11%;">Jatuh Tempo</th>
                        <th style="width: 13%;" class="text-right">Tagihan</th>
                        <th style="width: 13%;" class="text-right">Dibayar</th>
                        <th style="width: 13%;" class="text-right">Sisa</th>
                        <th style="width: 7%;">Status</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse($receivables as $index => $item)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $item['source_label'] }}</td>
                            <td>{{ $item['number'] }}</td>
                            <td>{{ $item['transaction_date'] }}</td>
                            <td>{{ $item['due_date'] }}</td>
                            <td class="text-right">{{ $item['total_amount_text'] }}</td>
                            <td class="text-right">{{ $item['paid_amount_text'] }}</td>
                            <td class="text-right">{{ $item['remaining_amount_text'] }}</td>
                            <td>
                                @if($item['status'] === 'Lunas')
                                    <span class="status status-lunas">Lunas</span>
                                @elseif($item['status'] === 'Jatuh Tempo')
                                    <span class="status status-jatuh">Jatuh Tempo</span>
                                @else
                                    <span class="status status-belum">Belum Lunas</span>
                                @endif
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="9" style="text-align: center; padding: 18px;">
                                Tidak ada piutang aktif untuk pelanggan ini.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="note-box">
            <strong>Catatan:</strong> Mohon melakukan pembayaran sesuai rincian piutang yang tertera.
            Apabila terdapat perbedaan data, pelanggan dapat menghubungi CV Jayanti Muliatama untuk konfirmasi lebih lanjut.
        </div>

        <div class="signature-layout">
            <div class="signature-left"></div>
            <div class="signature-right">
                <p>Medan, {{ now()->format('d M Y') }}</p>
                <p>Hormat kami,</p>
                <div class="signature-space"></div>
                <p><strong>CV Jayanti Muliatama</strong></p>
            </div>
        </div>

        <div class="footer">
            Dokumen ini dibuat secara otomatis melalui Sistem Informasi CV Jayanti Muliatama.
        </div>
    </div>
</body>
</html>