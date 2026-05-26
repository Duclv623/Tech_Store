import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "GoCart. - Quản trị viên",
    description: "GoCart. - Quản trị viên",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
