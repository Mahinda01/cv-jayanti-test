import CreateForm from '@/Components/Sales/CreateForm';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({
    products = [],
    customers = [],
    showCost = true,
}) {
    return (
        <CreateForm
            Layout={AdminLayout}
            products={products}
            customers={customers}
            routePrefix="admin"
            showCost={showCost}
        />
    );
}