import IndexContent from '@/Components/Purchases/IndexContent';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Index({ purchases = [] }) {
    return (
        <IndexContent
            Layout={StaffLayout}
            purchases={purchases}
            routePrefix="staff"
        />
    );
}