import CreateForm from '@/Components/Customers/CreateForm';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    return (
        <CreateForm
            Layout={AdminLayout}
            routePrefix="admin"
        />
    );
}