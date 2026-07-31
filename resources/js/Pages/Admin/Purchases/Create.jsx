import CreateForm from '@/Components/Purchases/CreateForm';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ products = [] }) {
    return (
        <CreateForm
            Layout={AdminLayout}
            products={products}
            routePrefix="admin"
        />
    );
}