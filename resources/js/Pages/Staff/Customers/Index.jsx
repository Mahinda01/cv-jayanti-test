import IndexContent from '@/Components/Customers/IndexContent';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({
    customers = [],
    showReceivable = false,
}) {
    return (
        <IndexContent
            Layout={StaffLayout}
            customers={customers}
            routePrefix="staff"
            showReceivable={showReceivable}
        />
    );
}