import CreateForm from '@/Components/Products/CreateForm';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({ categories = [] }) {
    return (
        <CreateForm
            Layout={StaffLayout}
            categories={categories}
            routePrefix="staff"
            allowNewCategory
        />
    );
}