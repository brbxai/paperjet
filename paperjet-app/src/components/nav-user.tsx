import { BadgeCheck, ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/actions/users/logout";
import Link from "next/link";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ring-ring hover:bg-accent data-[state=open]:bg-accent w-full rounded-md outline-none focus-visible:ring-2">
        <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all">
          <Avatar className="h-7 w-7 rounded-md border">
            <AvatarImage
              src={user.avatar}
              alt={user.name}
              className="animate-in fade-in-50 zoom-in-90"
            />
            <AvatarFallback className="rounded-md">
              <User className="size-3.5" />
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 leading-none">
            <div className="font-medium">{user.name}</div>
            <div className="text-muted-foreground overflow-hidden text-xs">
              <div className="line-clamp-1">{user.email}</div>
            </div>
          </div>
          <ChevronsUpDown className="text-muted-foreground/50 ml-auto mr-0.5 h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white"
        align="end"
        side="right"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
            <Avatar className="h-7 w-7 rounded-md">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <User className="size-3.5" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1">
              <div className="font-medium">{user.name}</div>
              <div className="text-muted-foreground overflow-hidden text-xs">
                <div className="line-clamp-1">{user.email}</div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer gap-2">
              <BadgeCheck className="text-muted-foreground h-4 w-4" />
              Account
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onClick={() => logout()}
        >
          <LogOut className="text-muted-foreground h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
