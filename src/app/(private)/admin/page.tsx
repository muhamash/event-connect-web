import AdminDashboard from "@/components/modules/dashboard/admin/AdminContainer"
import { Metadata } from "next"


export const metadata: Metadata = {
  title: 'Dashboard | EventConnect',
  description: 'Enjoy  dashboard ...',
}

export default function AdminDashBoardForAdmin() {
  return (
    <AdminDashboard/>
  )
}
