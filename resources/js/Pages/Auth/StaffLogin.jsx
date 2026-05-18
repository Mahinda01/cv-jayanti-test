import LoginForm from '@/Components/Auth/LoginForm';
import LoginLayout from '@/Components/Auth/LoginLayout';
import LoginSidePanel from '@/Components/Auth/LoginSidePanel';

export default function StaffLogin() {
    return (
        <LoginLayout>
            <LoginForm
                title="Masuk Staff"
                subtitle="Masuk dengan akun staff operasional"
                buttonText="Login Staff"
                expectedRole="staff"
                position="left"
            />

            <LoginSidePanel
                title="Mode Admin"
                description="Masuk dengan akun admin untuk mengelola seluruh sistem dan laporan"
                buttonText="Login Admin"
                buttonHref="/login/admin"
                position="right"
            />
        </LoginLayout>
    );
}