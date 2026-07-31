import CreateForm from '@/Components/Products/CreateForm';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories = [] }) {
    return (
        <CreateForm
            Layout={AdminLayout}
            categories={categories}
            routePrefix="admin"
            allowNewCategory
        />
    );
}