import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ClientsPage() {
  return (
    // <div className="flex flex-col p-5 max-w-6xl  mx-auto">
    //   <div className="flex items-center justify-between ">
    //     <div>
    //       <div className="flex gap-2">
    //         <h1>Clients list </h1>
    //         <span>67</span>
    //       </div>
    //       <p>View, add, edit and delete your client's details. </p>
    //     </div>
    //     <div>
    //       <Button size="custom-desktop">Add</Button>
    //     </div>
    //   </div>
    // </div>
    <div className="flex justify-center mt-8 w-full">
      <Card className=" ring-0 w-full max-w-6xl ">
        <CardHeader>
          <CardTitle className="text-xl">Card Title</CardTitle>
          <CardDescription className="font-medium">
            Card Description
          </CardDescription>
          <CardAction>
            <Button size="custom-desktop">Add</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
      </Card>
    </div>
  );
}
