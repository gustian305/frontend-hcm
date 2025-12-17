const pricingPlans = [
    {
        id: "basic",
        name: "Basic",
        price: 0,
        period: "per bulan",
        description:
            "Cocok untuk tim kecil yang ingin mulai menggunakan sistem HCM secara efisien.",
        features: [
            "Manajemen karyawan dasar",
            "Pelacakan absensi manual",
            "Akses maksimal 10 pengguna",
            "Dukungan via email",
        ],
        buttonText: "Mulai Gratis",
        highlight: false,
    },
    {
        id: "pro",
        name: "Professional",
        price: 199000,
        period: "per bulan",
        description:
            "Solusi lengkap untuk perusahaan yang ingin mengoptimalkan HR dengan automasi.",
        features: [
            "Semua fitur Basic",
            "Automasi approval cuti & lembur",
            "Integrasi payroll",
            "Analitik performa karyawan",
            "Support prioritas",
        ],
        buttonText: "Coba Sekarang",
        highlight: true, // bisa dipakai untuk memberi efek visual 'recommended'
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: "Kustom",
        period: "",
        description:
            "Didesain khusus untuk organisasi besar dengan kebutuhan kompleks.",
        features: [
            "Semua fitur Professional",
            "Integrasi SSO & API",
            "Dedicated account manager",
            "Pelatihan onboarding tim HR",
            "Dukungan 24/7",
        ],
        buttonText: "Hubungi Kami",
        highlight: false,
    },
];

export default pricingPlans;