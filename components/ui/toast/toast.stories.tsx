import type { Story } from "@ladle/react";
import { Toaster, toast } from "./index";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Toast",
};
export default meta;

export const Variants: Story = () => {
  return (
    <div className="p-8">
      {/* 
        In a real app, Toaster is rendered once at the root layout.
        For Ladle stories, we include it directly in the story. 
      */}
      <Toaster />
      
      <HStack gap="4" wrap="wrap">
        <Button
          onClick={() =>
            toast({
              title: "Message sent",
              description: "Your message has been sent to the group.",
            })
          }
        >
          Default
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Successfully saved",
              variant: "success",
            })
          }
        >
          Success
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Storage almost full",
              description: "You have used 90% of your storage quota.",
              variant: "warning",
            })
          }
        >
          Warning
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Failed to upload file",
              description: "Please check your network connection.",
              variant: "destructive",
              action: { label: "Retry", onPress: () => {} },
            })
          }
        >
          Destructive
        </Button>
      </HStack>
    </div>
  );
};

export const CustomIcon: Story = () => {
  return (
    <div className="p-8">
      <Toaster />
      <Button
        onClick={() =>
          toast({
            title: "New mail",
            description: "You have 3 unread messages.",
            icon: "bell",
          })
        }
      >
        Custom Icon (bell)
      </Button>
    </div>
  );
};
