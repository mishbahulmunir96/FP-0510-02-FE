// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import useGetProfile from "@/hooks/api/account/useGetProfile";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export const ProfileDetails = () => {
//   // Menggunakan hook untuk mendapatkan data profil
//   const { data: profileResponse, error } = useGetProfile();

//   if (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Terjadi kesalahan.";
//     return (
//       <div className="p-4">
//         <p className="text-red-500">Error loading profile: {errorMessage}</p>
//       </div>
//     );
//   }

//   // Mengakses data profil dari properti "data" pada respon
//   const profile = profileResponse?.data;

//   return (
//     <Card>
//       <CardContent className="p-4">
//         <div className="flex flex-col gap-6">
//           {/* Profile Picture Section */}
//           <div className="space-y-1.5">
//             <h2 className="text-base">Profile Picture</h2>
//             <div className="flex items-center space-x-4">
//               <Avatar className="h-28 w-28 md:h-36 md:w-36">
//                 <AvatarImage
//                   src={profile?.imageUrl || ""}
//                   alt="Profile picture"
//                 />
//                 <AvatarFallback>
//                   {profile?.name?.charAt(0).toUpperCase() || "U"}
//                 </AvatarFallback>
//               </Avatar>
//             </div>
//           </div>

//           {/* User Details */}
//           <div className="space-y-4">
//             {/* Name */}
//             <div className="space-y-1.5">
//               <h2 className="text-base">Full Name</h2>
//               <p className="text-sm text-gray-700">{profile?.name}</p>
//             </div>

//             {/* Email */}
//             <div className="space-y-1.5">
//               <h2 className="text-base">Email</h2>
//               <div className="flex items-center gap-2">
//                 <p className="text-sm text-gray-700">{profile?.email}</p>
//                 <span
//                   className={`rounded-full px-2 py-1 text-xs ${
//                     profile?.isVerified
//                       ? "bg-green-100 text-green-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {profile?.isVerified ? "Verified" : "Not Verified"}
//                 </span>
//               </div>
//             </div>

//             {/* Role */}
//             <div className="space-y-1.5">
//               <h2 className="text-base">Role</h2>
//               <p className="text-sm text-gray-700">{profile?.role}</p>
//             </div>

//             {/* Provider */}
//             <div className="space-y-1.5">
//               <h2 className="text-base">Login Provider</h2>
//               <p className="text-sm text-gray-700">{profile?.provider}</p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };
