import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "GoCart. - Bảng điều khiển Cửa hàng",
    description: "GoCart. - Bảng điều khiển Cửa hàng",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
