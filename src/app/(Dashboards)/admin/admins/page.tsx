import { GetAdmins } from '@/ServerActions/Admin/GetAdmins';
import AdminsLayout from '../_Components/admins-layout';

export default async function page() {
  const admins = await GetAdmins();
  return (
    <AdminsLayout
    initialAdmins={admins}
    />
  )
}
