import IndexContent from '@/Components/Products/IndexContent';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ products = [] }) {
    return (
        <IndexContent
            Layout={AdminLayout}
            products={products}
            routePrefix="admin"
        />
    );
}