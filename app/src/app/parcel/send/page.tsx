import { MainLayout } from "@/components/app-layout";
import UserPage from "@/components/role/user";
import { H1 } from "@/components/ui/typohraphy";
import SendForm from "./_components/form";

const SendParcel = () => {
  return (
    <MainLayout>
      <UserPage>
        <H1>Send your parcel</H1>
        <SendForm />
      </UserPage>
    </MainLayout>
  );
};

export default SendParcel;
