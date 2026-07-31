import IndexContent from '@/Components/Sales/IndexContent';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({
    sales = [],
}) {
    return (
        <IndexContent
            Layout={AdminLayout}
            sales={sales}
            routePrefix="admin"
        />
    );
}