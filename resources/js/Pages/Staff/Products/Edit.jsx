import EditForm from '@/Components/Products/EditForm';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({ product, categories = [] }) {
    return (
        <EditForm
            Layout={StaffLayout}
            product={product}
            categories={categories}
            routePrefix="staff"
        />
    );
}