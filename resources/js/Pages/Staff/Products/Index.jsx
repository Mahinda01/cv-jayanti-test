import IndexContent from '@/Components/Products/IndexContent';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ products = [] }) {
    return (
        <IndexContent
            Layout={StaffLayout}
            products={products}
            routePrefix="staff"
        />
    );
}