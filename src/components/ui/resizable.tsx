import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import
  {
    Panel,
    PanelGroup,
    PanelResizeHandle,
  } from "react-resizable-panels";

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof PanelGroup>) => (
  <PanelGroup
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...(props as any)}
  />
);

const ResizablePanel = Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof PanelResizeHandle> & { withHandle?: boolean }) => (
  <PanelResizeHandle
    className={cn(
      /* your styles here */
    )}
    {...(props as any)}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </PanelResizeHandle>
);

export { ResizableHandle, ResizablePanel, ResizablePanelGroup };
