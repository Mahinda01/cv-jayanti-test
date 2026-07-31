import IndexContent from '@/Components/Customers/IndexContent';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({
    customers = [],
    showReceivable = true,
}) {
    return (
        <IndexContent
            Layout={AdminLayout}
            customers={customers}
            routePrefix="admin"
            showReceivable={showReceivable}
        />
    );
}