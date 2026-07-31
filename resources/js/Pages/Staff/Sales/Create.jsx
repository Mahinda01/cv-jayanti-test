import CreateForm from '@/Components/Sales/CreateForm';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Create({
    products = [],
    customers = [],
    showCost = false,
}) {
    return (
        <CreateForm
            Layout={StaffLayout}
            products={products}
            customers={customers}
            routePrefix="staff"
            showCost={showCost}
        />
    );
}