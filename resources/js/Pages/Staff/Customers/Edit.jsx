import EditForm from '@/Components/Customers/EditForm';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Edit({
    customer,
    showReceivable = false,
}) {
    return (
        <EditForm
            Layout={StaffLayout}
            customer={customer}
            routePrefix="staff"
            showReceivable={showReceivable}
        />
    );
}