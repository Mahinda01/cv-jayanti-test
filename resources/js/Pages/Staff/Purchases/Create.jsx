import CreateForm from '@/Components/Purchases/CreateForm';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ products = [] }) {
    return (
        <CreateForm
            Layout={StaffLayout}
            products={products}
            routePrefix="staff"
        />
    );
}