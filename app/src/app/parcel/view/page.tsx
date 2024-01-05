import { MainLayout } from "@/components/app-layout";
import { ParcelIcon } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { H1 } from "@/components/ui/typography";
import TrackingNumberInput from "./trackingNumberInput";

const FindByTrackingNumber = () => {
  return (
    <Card className="h-fit w-full max-w-md">
      <CardHeader className="flex items-center gap-2 flex-row">
        <ParcelIcon className="h-6 w-6" />
        <CardTitle className="!mt-0">Where is my parcel?</CardTitle>
      </CardHeader>
      <CardContent>
        <TrackingNumberInput />
      </CardContent>
    </Card>
  );
};

const FindParcelPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <H1>Find Parcel</H1>
        <FindByTrackingNumber />
      </div>
    </MainLayout>
  );
};

export default FindParcelPage;
