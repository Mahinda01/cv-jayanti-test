import IndexContent from '@/Components/Sales/IndexContent';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({
    sales = [],
}) {
    return (
        <IndexContent
            Layout={StaffLayout}
            sales={sales}
            routePrefix="staff"
        />
    );
}