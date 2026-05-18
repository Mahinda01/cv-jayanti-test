import LoginForm from '@/Components/Auth/LoginForm';
import LoginLayout from '@/Components/Auth/LoginLayout';
import LoginSidePanel from '@/Components/Auth/LoginSidePanel';

export default function AdminLogin() {
    return (
        <LoginLayout>
            <LoginSidePanel
                title="Mode Staff"
                description="Masuk dengan akun staff untuk mengelola transaksi harian dan data pelanggan"
                buttonText="Login Staff"
                buttonHref="/login/staff"
                position="left"
            />

            <LoginForm
                title="Masuk Admin"
                subtitle="Masuk dengan akun administrator"
                buttonText="Login Admin"
                expectedRole="admin"
                position="right"
            />
        </LoginLayout>
    );
}