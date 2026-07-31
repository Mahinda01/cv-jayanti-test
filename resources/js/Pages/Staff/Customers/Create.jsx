import CreateForm from '@/Components/Customers/CreateForm';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create() {
    return (
        <CreateForm
            Layout={StaffLayout}
            routePrefix="staff"
        />
    );
}