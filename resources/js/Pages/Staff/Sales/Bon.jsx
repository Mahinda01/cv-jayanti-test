import BonContent from '@/Components/Sales/BonContent';
import StaffLayout from '@/Layouts/StaffLayout';

export default function Bon({ sale }) {
    return (
        <BonContent
            Layout={StaffLayout}
            sale={sale}
            routePrefix="staff"
        />
    );
}