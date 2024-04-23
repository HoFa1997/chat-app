import { IoSettingsOutline } from "react-icons/io5";
import { Avatar } from "@/components/ui/Avatar";
import ThemeChanger from "./ThemeChanger";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/Popover";
import { logout } from "@/api";
import { useRouter } from "next/router";
import WorkspaceLists from "./WokrspaceLists";
import NewWorkspaceModal from "./NewWorkspaceModal";
import { useAuthStore } from "@stores/index";
import { useSupabase } from "@/shared";

const WorkspaceSidebar = () => {
  const profile = useAuthStore((state) => state.profile);
  const displayName = useAuthStore((state) => state.displayName);
  const router = useRouter();
  const { loading, request, setLoading } = useSupabase(logout, null, false);

  const handleLogout = async () => {
    await request();
    setLoading(true);
    router.push("/login");
    router.reload();
  };

  if (!profile) return null;
  return (
    <div className="flex h-dvh max-w-20 flex-col items-center bg-base-100 p-0 text-base-content">
      <div className="w-8 py-4 ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="Layer_1"
          data-name="Layer 1"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          className="fill-current"
        >
          <path d="m16.713,13.804c.384.393.381,1.02-.009,1.406-.074.073-1.84,1.79-4.704,1.79s-4.63-1.716-4.704-1.79c-.392-.389-.396-1.021-.007-1.414.39-.392,1.021-.396,1.415-.007.046.045,1.28,1.21,3.296,1.21s3.25-1.166,3.302-1.215c.396-.382,1.028-.374,1.411.02Zm-8.213-2.804c.828,0,1.5-.672,1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5,1.5.672,1.5,1.5,1.5Zm7-3c-.828,0-1.5.672-1.5,1.5s.672,1.5,1.5,1.5,1.5-.672,1.5-1.5-.672-1.5-1.5-1.5Zm8.5,4.34v6.66c0,2.757-2.243,5-5,5h-5.917C6.082,24,.471,19.208.029,12.854c-.24-3.476,1.027-6.878,3.479-9.333C5.962,1.065,9.371-.205,12.836.029c6.261.425,11.164,5.833,11.164,12.312Zm-2,0c0-5.431-4.085-9.962-9.299-10.316-.229-.016-.458-.023-.687-.023-2.656,0-5.209,1.048-7.091,2.933-2.043,2.046-3.1,4.883-2.898,7.782.372,5.38,5.023,9.285,11.058,9.285h5.917c1.654,0,3-1.346,3-3v-6.66Z" />
        </svg>
      </div>
      <div className="my-auto max-h-[60%] overflow-hidden overflow-y-auto px-1 ">
        <WorkspaceLists />
      </div>
      <ThemeChanger />
      <div className="my-2">
        <button className="btn btn-ghost btn-sm rounded-btn">
          <IoSettingsOutline size={22} />
        </button>
      </div>

      <NewWorkspaceModal />
      <div className="mb-3 mt-1 flex w-9">
        <Popover placement="right-end">
          <PopoverTrigger asChild={true}>
            <div className="tooltip tooltip-right" data-tip={displayName}>
              <Avatar
                src={profile.avatar_url}
                alt={`avatar_${profile.id}`}
                id={profile.id}
                size={40}
                className="m-0 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="z-50 rounded-box border bg-base-100 p-4 shadow-md outline-none">
            <div className="flex items-center justify-start">
              <div className="mr-4 w-12">
                <Avatar
                  displayPresence={true}
                  src={profile.avatar_url}
                  online={profile.status === "ONLINE" ? true : false}
                  alt={`avatar_${profile.id}`}
                  id={profile.id}
                  size={40}
                  className="m-0 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100"
                />
              </div>
              <div>
                <p className="truncate text-sm">{displayName}</p>
                <span className="text-xs font-bold">{profile.status}</span>
              </div>
            </div>
            <div className="divider my-1"></div>
            <button className="btn btn-sm btn-block mb-2">Profile</button>
            <button className="btn btn-sm btn-block ">Prefrences</button>
            <div className="divider my-1"></div>
            <button className="btn btn-sm btn-block" onClick={handleLogout} disabled={loading}>
              Sign out
              {loading && <span className="loading loading-spinner ml-auto"></span>}
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
