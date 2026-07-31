import EditForm from '@/Components/Customers/EditForm';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({
    customer,
    showReceivable = true,
}) {
    return (
        <EditForm
            Layout={AdminLayout}
            customer={customer}
            routePrefix="admin"
            showReceivable={showReceivable}
        />
    );
}