import BonContent from '@/Components/Sales/BonContent';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Bon({ sale }) {
    return (
        <BonContent
            Layout={AdminLayout}
            sale={sale}
            routePrefix="admin"
        />
    );
}