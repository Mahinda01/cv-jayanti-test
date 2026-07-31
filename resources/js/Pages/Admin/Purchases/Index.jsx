import IndexContent from '@/Components/Purchases/IndexContent';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ purchases = [] }) {
    return (
        <IndexContent
            Layout={AdminLayout}
            purchases={purchases}
            routePrefix="admin"
        />
    );
}