import EditForm from '@/Components/Products/EditForm';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ product, categories = [] }) {
    return (
        <EditForm
            Layout={AdminLayout}
            product={product}
            categories={categories}
            routePrefix="admin"
        />
    );
}